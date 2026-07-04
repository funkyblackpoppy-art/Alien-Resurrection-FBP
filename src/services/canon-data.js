// Black Poppy Canon — canon-data adapter (AD-006)
// THE data contract. All Canon data flows through here — views never
// touch JSON files or storage keys directly. Mock mode until Sprint 6,
// when the internals swap to the Google Sheets backend. The surface
// of this module must not change when that happens.
//
// The Entry is the atomic unit of the entire system:
//   { id, bookId, type, title, tags, status, body, author,
//     version, created, updated, relationships[], versions[] }
//
// Nothing is deleted. Entries archive; every explicit save creates
// a version.

import { storage } from './storage.js';
import { createRelationship } from './RelationshipService.js';

const LOCAL_ENTRIES = 'bpc-canon-entries'; // { [id]: entry } local overrides + creations

export const ENTRY_TYPES = [
  'Canon Entry', 'Journal', 'Dream', 'Looking Glass', 'Atelier',
  'Symbol', 'Companion', 'Project', 'Product', 'Engineering Decision',
  'Sprint', 'Release Note', 'Research', 'Meeting Notes', 'Reference',
];

export const ENTRY_STATUSES = ['looking-glass', 'atelier', 'canon', 'archived'];

export const RELATIONSHIP_TYPES = [
  'book', 'project', 'symbol', 'visual', 'companion', 'product', 'entry',
];

/* ---------- seed loading (mock mode) ---------- */

const seedCache = {};

async function loadSeed(name) {
  if (seedCache[name]) return seedCache[name];
  try {
    const res = await fetch(new URL(`../data/${name}.json`, import.meta.url));
    seedCache[name] = res.ok ? await res.json() : [];
  } catch {
    seedCache[name] = [];
  }
  return seedCache[name];
}

function localEntries() {
  return storage.get(LOCAL_ENTRIES, {});
}

function persistEntry(entry) {
  const local = localEntries();
  local[entry.id] = entry;
  storage.set(LOCAL_ENTRIES, local);
  // Tell the shell the Canon grew — dashboard and search stay current.
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bpc:data-changed'));
  }
  return entry;
}

function nowISO() {
  return new Date().toISOString();
}

/* ---------- books ---------- */

export async function listBooks() {
  return loadSeed('books');
}

export async function getBook(id) {
  const books = await listBooks();
  return books.find((b) => b.id === id) || null;
}

/* ---------- symbols (the Symbolarium) ---------- */

export async function listSymbols() {
  return loadSeed('symbols');
}

export async function getSymbol(id) {
  const symbols = await listSymbols();
  return symbols.find((s) => s.id === id) || null;
}

/* ---------- entries ---------- */

export async function listEntries() {
  const seeds = await loadSeed('entries');
  const local = localEntries();
  const merged = new Map();
  seeds.forEach((e) => merged.set(e.id, e));
  Object.values(local).forEach((e) => merged.set(e.id, e));
  return [...merged.values()].sort(
    (a, b) => new Date(b.updated) - new Date(a.updated)
  );
}

export async function getEntry(id) {
  const local = localEntries();
  if (local[id]) return local[id];
  const seeds = await loadSeed('entries');
  return seeds.find((e) => e.id === id) || null;
}

export async function createEntry(partial = {}) {
  const stamp = nowISO();
  const entry = {
    id: `ENT-${Date.now().toString(36).toUpperCase()}`,
    bookId: partial.bookId || 'BOOK-003',
    type: partial.type || 'Canon Entry',
    title: partial.title || 'Untitled Entry',
    tags: partial.tags || [],
    status: partial.status || 'atelier',
    body: partial.body || '',
    author: partial.author || 'Rachael Nike',
    version: 1,
    created: stamp,
    updated: stamp,
    relationships: partial.relationships || [],
    versions: [
      { version: 1, timestamp: stamp, summary: 'Entry begun.', author: partial.author || 'Rachael Nike' },
    ],
  };
  persistEntry(entry);
  // Canon rule: an Entry cannot exist without a parent Book.
  // The Belongs To thread is drawn automatically — never wired by hand.
  await createRelationship({
    source: entry.id,
    target: entry.bookId,
    type: 'Belongs To',
    author: entry.author,
  });
  return entry;
}

// Explicit save — creates a version. Nothing is deleted.
export async function saveEntry(entry, summary = '') {
  const stamp = nowISO();
  const next = {
    ...entry,
    version: (entry.version || 0) + 1,
    updated: stamp,
    versions: [
      ...(entry.versions || []),
      {
        version: (entry.version || 0) + 1,
        timestamp: stamp,
        summary: summary || 'Saved.',
        author: entry.author,
        body: entry.body,
      },
    ],
  };
  return persistEntry(next);
}

// Autosave — keeps the draft safe without minting a version.
export async function autosaveEntry(entry) {
  return persistEntry({ ...entry, updated: nowISO() });
}

// Archive, never delete.
export async function archiveEntry(entry) {
  return saveEntry({ ...entry, status: 'archived' }, 'Archived.');
}

/* ---------- relationships ---------- */

export async function listRelationships(entryId) {
  const seeded = await loadSeed('relationships');
  const entry = await getEntry(entryId);
  const own = (entry?.relationships || []).map((r) => ({ from: entryId, to: r.targetId, type: r.type, label: r.label || '' }));
  const external = seeded.filter((r) => r.from === entryId || r.to === entryId);
  const seen = new Set();
  return [...own, ...external].filter((r) => {
    const key = `${r.from}→${r.to}·${r.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
