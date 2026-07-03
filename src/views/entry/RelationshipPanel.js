// Black Poppy Canon — RelationshipPanel
// Every Entry may reach toward Books, Projects, Symbols, Visual
// Components, Companions, Products, and other Entries. Unlimited.

import { RELATIONSHIP_TYPES } from '../../services/canon-data.js';

const TYPE_LABELS = {
  book: 'Book', project: 'Project', symbol: 'Symbol', visual: 'Visual Component',
  companion: 'Companion', product: 'Product', entry: 'Entry',
};

export function RelationshipPanel({ entry, books, entries, onChange }) {
  const el = document.createElement('details');
  el.className = 'card entry-panel entry-panel--relationships';
  el.id = 'relationship-panel';
  el.open = true;

  const summary = document.createElement('summary');
  summary.className = 'entry-panel__summary';
  summary.textContent = 'Relationships';
  el.appendChild(summary);

  const body = document.createElement('div');
  el.appendChild(body);

  const titleFor = (rel) => {
    if (rel.type === 'book') return books.find((b) => b.id === rel.targetId)?.title;
    if (rel.type === 'entry') return entries.find((e) => e.id === rel.targetId)?.title;
    return null;
  };

  function paint() {
    body.innerHTML = '';
    const rels = entry.relationships || [];

    if (!rels.length) {
      const p = document.createElement('p');
      p.className = 'panel__empty';
      p.textContent = 'This entry stands alone for now. Every connection you add becomes a root.';
      body.appendChild(p);
    } else {
      const ul = document.createElement('ul');
      ul.className = 'panel__list entry-rel-list';
      rels.forEach((rel, index) => {
        const li = document.createElement('li');

        const chip = document.createElement('span');
        chip.className = `chip chip--${rel.type}`;
        chip.textContent = TYPE_LABELS[rel.type] || rel.type;

        const label = document.createElement('span');
        label.className = 'entry-rel-label';
        const known = titleFor(rel);
        if (rel.type === 'entry' && known) {
          const a = document.createElement('a');
          a.href = `#/entry/${rel.targetId}`;
          a.textContent = known;
          label.appendChild(a);
        } else {
          label.textContent = known || rel.label || rel.targetId;
        }

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'entry-rel-remove';
        remove.setAttribute('aria-label', `Remove relationship to ${rel.label || rel.targetId}`);
        remove.textContent = '×';
        remove.addEventListener('click', () => {
          const next = rels.filter((_, i) => i !== index);
          onChange({ relationships: next });
          entry.relationships = next;
          paint();
        });

        li.append(chip, label, remove);
        ul.appendChild(li);
      });
      body.appendChild(ul);
    }

    /* ---- add form ---- */
    const form = document.createElement('form');
    form.className = 'entry-rel-form';

    const type = document.createElement('select');
    type.className = 'entry-input';
    type.setAttribute('aria-label', 'Relationship type');
    RELATIONSHIP_TYPES.forEach((t) => {
      const o = document.createElement('option');
      o.value = t;
      o.textContent = TYPE_LABELS[t];
      type.appendChild(o);
    });

    const target = document.createElement('input');
    target.className = 'entry-input';
    target.type = 'text';
    target.placeholder = 'What does it connect to?';
    target.setAttribute('aria-label', 'Relationship target');
    target.setAttribute('list', 'bpc-rel-targets');

    const datalist = document.createElement('datalist');
    datalist.id = 'bpc-rel-targets';

    function fillDatalist() {
      datalist.innerHTML = '';
      const source = type.value === 'book' ? books
        : type.value === 'entry' ? entries.filter((e) => e.id !== entry.id)
        : [];
      source.forEach((item) => {
        const o = document.createElement('option');
        o.value = item.title;
        datalist.appendChild(o);
      });
    }
    fillDatalist();
    type.addEventListener('change', fillDatalist);

    const add = document.createElement('button');
    add.className = 'btn btn--ghost';
    add.type = 'submit';
    add.textContent = 'Connect';

    form.append(type, target, datalist, add);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = target.value.trim();
      if (!raw) return;

      // Resolve friendly names to canon IDs where we can.
      let targetId = raw;
      if (type.value === 'book') {
        targetId = books.find((b) => b.title.toLowerCase() === raw.toLowerCase())?.id || raw;
      } else if (type.value === 'entry') {
        targetId = entries.find((en) => en.title.toLowerCase() === raw.toLowerCase())?.id || raw;
      }

      const next = [...(entry.relationships || []), { type: type.value, targetId, label: raw }];
      onChange({ relationships: next });
      entry.relationships = next;
      paint();
    });

    body.appendChild(form);
  }

  paint();
  return el;
}
