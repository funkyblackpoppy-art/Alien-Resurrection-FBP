// Black Poppy Canon — Worktable service (Sprint 4.6 · APP-006)
// Part of the adapter layer (AD-006). A Worktable is a living creative
// surface — not a file, not a folder, not a page. Everything in the
// Atelier happens on one. Local persistence now; the Root System and
// backend sync arrive beneath this surface without changing it.
//
// Worktable: { id, name, template, objects[], connections[], version,
//              created, updated }
// Object:    { id, type, title, content, x, y, w, h, status, tags[],
//              favorite, refId, created, updated, notes }

import { storage } from './storage.js';
import { createRelationship } from './RelationshipService.js';
import * as canonData from './canon-data.js';

const LOCAL_KEY = 'bpc-worktables'; // { [id]: worktable }

export const OBJECT_TYPES = [
  'sticky', 'note', 'image', 'symbol', 'entry', 'swatch', 'url', 'checklist',
];

export const WORKTABLE_TEMPLATES = {
  'Blank': [],
  'Packaging': [
    { type: 'sticky', title: 'Front of pack', content: '' },
    { type: 'sticky', title: 'Back of pack', content: '' },
    { type: 'swatch', title: 'Primary color', content: '#4A3459' },
    { type: 'checklist', title: 'Print checklist', content: '[ ] Dieline\n[ ] Bleed\n[ ] Barcode' },
  ],
  'Mood Board': [
    { type: 'sticky', title: 'The feeling', content: '' },
    { type: 'swatch', title: 'Color one', content: '#8B7A9E' },
    { type: 'swatch', title: 'Color two', content: '#E24E9B' },
  ],
  'Product Design': [
    { type: 'sticky', title: 'What is it?', content: '' },
    { type: 'sticky', title: 'Who is it for?', content: '' },
    { type: 'checklist', title: 'Next steps', content: '[ ] Sketch\n[ ] Materials\n[ ] Price' },
  ],
  'Brand Identity': [
    { type: 'sticky', title: 'Voice', content: '' },
    { type: 'swatch', title: 'Metallic (silver, never gold)', content: '#C6C2CC' },
    { type: 'note', title: 'Typography', content: 'Display: Bebas Neue\nBody: Libre Baskerville' },
  ],
  'Research': [
    { type: 'sticky', title: 'Question', content: '' },
    { type: 'note', title: 'Findings', content: '' },
    { type: 'url', title: 'Source', content: 'https://' },
  ],
  'Creative Writing': [
    { type: 'note', title: 'Draft', content: '' },
    { type: 'sticky', title: 'The one true sentence', content: '' },
  ],
  'Engineering': [
    { type: 'checklist', title: 'Definition of done', content: '[ ] Built\n[ ] Tested\n[ ] Documented' },
    { type: 'note', title: 'Decision record', content: '' },
  ],
  'Garden Planning': [
    { type: 'sticky', title: 'This season', content: '' },
    { type: 'checklist', title: 'Beds', content: '[ ] Prepare\n[ ] Plant\n[ ] Mulch' },
  ],
};

const now = () => new Date().toISOString();
const uid = (prefix) =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1296).toString(36).toUpperCase()}`;

function all() {
  return storage.get(LOCAL_KEY, {});
}

function persist(table) {
  const tables = all();
  table.updated = now();
  tables[table.id] = table;
  const okay = storage.set(LOCAL_KEY, tables);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bpc:data-changed'));
  }
  return okay;
}

/* ---------- worktables ---------- */

export async function listWorktables() {
  return Object.values(all()).sort((a, b) => new Date(b.updated) - new Date(a.updated));
}

export async function getWorktable(id) {
  return all()[id] || null;
}

export async function createWorktable({ name, template = 'Blank' } = {}) {
  const table = {
    id: uid('WT'),
    name: name || 'Untitled Worktable',
    template,
    objects: [],
    connections: [],
    version: 1,
    created: now(),
    updated: now(),
  };
  (WORKTABLE_TEMPLATES[template] || []).forEach((seed, i) => {
    table.objects.push(makeObject({
      ...seed,
      x: 60 + (i % 3) * 260,
      y: 60 + Math.floor(i / 3) * 220,
    }));
  });
  persist(table);
  return table;
}

export async function saveWorktable(table) {
  return persist(table);
}

/* ---------- objects ---------- */

export function makeObject({ type = 'sticky', title = '', content = '', x = 80, y = 80, w, h, refId = null } = {}) {
  const sizes = {
    sticky: [220, 160], note: [280, 200], image: [260, 200], symbol: [160, 120],
    entry: [260, 120], swatch: [150, 120], url: [240, 90], checklist: [240, 180],
  };
  const [dw, dh] = sizes[type] || [220, 160];
  return {
    id: uid('OBJ'),
    type,
    title: title || defaultTitle(type),
    content,
    x, y,
    w: w || dw,
    h: h || dh,
    status: 'atelier',
    tags: [],
    favorite: false,
    refId,
    version: 1,
    created: now(),
    updated: now(),
    notes: '',
  };
}

function defaultTitle(type) {
  const names = {
    sticky: 'Sticky note', note: 'Note', image: 'Image', symbol: 'Symbol',
    entry: 'Canon entry', swatch: 'Swatch', url: 'Link', checklist: 'Checklist',
  };
  return names[type] || 'Object';
}

export async function addObject(table, partial) {
  const obj = makeObject(partial);
  table.objects.push(obj);
  persist(table);
  return obj;
}

export async function updateObject(table, id, patch) {
  const obj = table.objects.find((o) => o.id === id);
  if (!obj) return null;
  Object.assign(obj, patch, { updated: now(), version: (obj.version || 1) + (patch.content !== undefined || patch.title !== undefined ? 1 : 0) });
  persist(table);
  return obj;
}

export async function removeObject(table, id) {
  table.objects = table.objects.filter((o) => o.id !== id);
  table.connections = (table.connections || []).filter((c) => c.from !== id && c.to !== id);
  persist(table);
}

export async function duplicateObject(table, id) {
  const src = table.objects.find((o) => o.id === id);
  if (!src) return null;
  const copy = makeObject({ ...src, x: src.x + 24, y: src.y + 24 });
  copy.title = src.title;
  copy.w = src.w; copy.h = src.h;
  copy.tags = [...(src.tags || [])];
  table.objects.push(copy);
  persist(table);
  return copy;
}

/* ---------- connections: lines are data, not decoration ---------- */

export async function connectObjects(table, fromId, toId) {
  const a = table.objects.find((o) => o.id === fromId);
  const b = table.objects.find((o) => o.id === toId);
  if (!a || !b || fromId === toId) return null;

  // The relationship lives in the Canon: prefer the canon identity
  // of each object (an entry or symbol it references) over its
  // table-local id, so the knowledge graph truly grows.
  const rel = await createRelationship({
    source: a.refId || a.id,
    target: b.refId || b.id,
    type: 'Related',
    notes: `Connected on worktable “${table.name}”.`,
    sourceLabel: a.title,
    targetLabel: b.title,
  });

  table.connections = table.connections || [];
  table.connections.push({ from: fromId, to: toId, relId: rel.id });
  persist(table);
  return rel;
}

/* ---------- promote to Canon ---------- */

export async function promoteToCanon(table, id) {
  const obj = table.objects.find((o) => o.id === id);
  if (!obj) return null;

  const body = obj.type === 'image'
    ? `![${obj.title}](${obj.content})`
    : obj.type === 'checklist'
      ? obj.content.split('\n').map((l) => l.trim() ? `- ${l.replace(/^\[( |x)\]\s*/i, (m, c) => `[${c.trim() ? 'x' : ' '}] `)}` : '').join('\n')
      : obj.content || '';

  const entry = await canonData.createEntry({
    bookId: 'BOOK-011', // the Atelier's own Book
    type: 'Atelier',
    title: obj.title,
    body,
    status: 'canon',
    tags: obj.tags,
  });

  await createRelationship({
    source: entry.id,
    target: table.id,
    type: 'Atelier Prototype',
    notes: `Promoted from worktable “${table.name}”.`,
  });

  obj.status = 'canon';
  obj.refId = entry.id;
  persist(table);
  return entry;
}

/* ---------- canon presence ---------- */

export function presenceBadge(status) {
  return status === 'canon' ? '🏛' : status === 'looking-glass' ? '🪞' : status === 'archived' ? '·' : '🎨';
}
