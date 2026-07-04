// Black Poppy Canon — Relationship Engine (Sprint 4.5 · APP-005)
// Part of the canon-data adapter layer (AD-006): views never touch
// relationship JSON or storage keys directly — everything flows
// through this service. Mock mode until Sprint 6.
//
// The Relationship is a first-class object:
//   { id, source, target, type, created, author, notes, version, status }
//
// Lookups are O(1): every load builds source→[] and target→[] indexes.
// Nothing is deleted — relationships archive.

import { storage } from './storage.js';

const LOCAL_KEY = 'bpc-relationships';       // { [id]: relationship }
const MIGRATED_KEY = 'bpc-relationships-migrated';

export const RELATIONSHIP_TYPES = [
  'Belongs To', 'References', 'Inspired By', 'Continues',
  'Parent', 'Child', 'Related', 'Companion', 'Symbol', 'Product',
  'Visual Component', 'Engineering Decision', 'Sprint', 'Project',
  'Looking Glass Idea', 'Atelier Prototype',
];

// Relationship colors (APP-005): quiet, editorial, never neon.
const TYPE_COLORS = {
  'Belongs To': 'stone',
  'Inspired By': 'finch',
  'Project': 'dusty',
  'Symbol': 'pink',
  'Engineering Decision': 'slate',
  'Sprint': 'slate',
  'Looking Glass Idea': 'lavender',
  'Atelier Prototype': 'dusty',
};

export function typeColor(type) {
  return TYPE_COLORS[type] || 'stone';
}

/* ---------- load & merge (seeds + local) ---------- */

let seedCache = null;

async function loadSeeds() {
  if (seedCache) return seedCache;
  try {
    const res = await fetch(new URL('../data/relationships.json', import.meta.url));
    const raw = res.ok ? await res.json() : [];
    // Accept pre-4.5 rows ({from, to, type, label}) so old exports still read.
    seedCache = raw.map((r, i) =>
      r.id ? r : {
        id: `REL-LEGACY-${i + 1}`,
        source: r.from,
        target: r.to,
        type: r.type === 'book' ? 'Belongs To' : 'References',
        created: '2026-07-03',
        author: 'Zorya',
        notes: r.label || '',
        version: 1,
        status: 'canon',
      }
    );
  } catch {
    seedCache = [];
  }
  return seedCache;
}

function localRels() {
  return storage.get(LOCAL_KEY, {});
}

function persist(rel) {
  const local = localRels();
  local[rel.id] = rel;
  storage.set(LOCAL_KEY, local);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bpc:data-changed'));
  }
  return rel;
}

/* ---------- indexes: O(1) lookup by source and target ---------- */

export function buildIndexes(relationships) {
  const bySource = new Map();
  const byTarget = new Map();
  relationships.forEach((rel) => {
    if (!bySource.has(rel.source)) bySource.set(rel.source, []);
    bySource.get(rel.source).push(rel);
    if (!byTarget.has(rel.target)) byTarget.set(rel.target, []);
    byTarget.get(rel.target).push(rel);
  });
  return { bySource, byTarget };
}

let indexes = null;
let indexStamp = '';

async function ensureIndexes() {
  const rels = await listAll();
  // Rebuild only when the collection actually changed.
  const stamp = `${rels.length}·${rels[rels.length - 1]?.id || ''}`;
  if (!indexes || stamp !== indexStamp) {
    indexes = buildIndexes(rels);
    indexStamp = stamp;
  }
  return indexes;
}

if (typeof window !== 'undefined') {
  window.addEventListener('bpc:data-changed', () => { indexes = null; });
}

/* ---------- public surface ---------- */

export async function listAll() {
  const seeds = await loadSeeds();
  const local = localRels();
  const merged = new Map();
  seeds.forEach((r) => merged.set(r.id, r));
  Object.values(local).forEach((r) => merged.set(r.id, r));
  return [...merged.values()];
}

// Everything touching an entry, sorted incoming/outgoing. O(1) via index.
export async function listForEntry(id) {
  const idx = await ensureIndexes();
  return {
    outgoing: (idx.bySource.get(id) || []).filter((r) => r.status !== 'archived'),
    incoming: (idx.byTarget.get(id) || []).filter((r) => r.status !== 'archived'),
  };
}

export async function createRelationship({ source, target, type, notes = '', author = 'Rachael Nike' }) {
  const rel = {
    id: `REL-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 36).toString(36).toUpperCase()}`,
    source,
    target,
    type: RELATIONSHIP_TYPES.includes(type) ? type : 'Related',
    created: new Date().toISOString(),
    author,
    notes,
    version: 1,
    status: 'canon',
  };
  return persist(rel);
}

// Archive, never delete.
export async function archiveRelationship(rel) {
  return persist({ ...rel, status: 'archived', version: (rel.version || 1) + 1 });
}

export async function recentRelationships(limit = 5) {
  const rels = (await listAll()).filter((r) => r.status !== 'archived');
  return rels
    .slice()
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .slice(0, limit);
}

// One-degree neighborhood of an id (for graph and related search).
export async function neighbors(id) {
  const { outgoing, incoming } = await listForEntry(id);
  return [
    ...outgoing.map((r) => ({ id: r.target, rel: r, direction: 'out' })),
    ...incoming.map((r) => ({ id: r.source, rel: r, direction: 'in' })),
  ];
}

/* ---------- migration: embedded entry.relationships → objects ----------
   Pre-4.5 entries carried { type, targetId, label } inline. Harvest them
   once into first-class relationships; the entry keeps its field (its
   shape is the Sprint 6 migration test case and must not break). */

export async function migrateFromEntries(entries) {
  if (storage.get(MIGRATED_KEY, false)) return;
  const existing = await listAll();
  const seen = new Set(existing.map((r) => `${r.source}→${r.target}·${r.type}`));
  const local = localRels();

  entries.forEach((entry) => {
    (entry.relationships || []).forEach((old, i) => {
      const type = old.type === 'book' ? 'Belongs To'
        : old.type === 'entry' ? 'References'
        : old.type === 'symbol' ? 'Symbol'
        : old.type === 'companion' ? 'Companion'
        : old.type === 'product' ? 'Product'
        : old.type === 'visual' ? 'Visual Component'
        : old.type === 'project' ? 'Project'
        : 'Related';
      const key = `${entry.id}→${old.targetId}·${type}`;
      if (seen.has(key)) return;
      seen.add(key);
      local[`REL-M-${entry.id}-${i}`] = {
        id: `REL-M-${entry.id}-${i}`,
        source: entry.id,
        target: old.targetId,
        type,
        created: entry.updated || entry.created,
        author: entry.author || '',
        notes: old.label || '',
        version: 1,
        status: 'canon',
      };
    });
  });

  storage.set(LOCAL_KEY, local);
  storage.set(MIGRATED_KEY, true);
  indexes = null;
}
