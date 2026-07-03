// Black Poppy Canon — Library view (placeholder)
import { EmptyState } from '../components/card.js';

export function LibraryView() {
  const view = document.createElement('div');
  view.appendChild(
    EmptyState({
      symbol: 'book',
      title: 'The Library is being bound.',
      body: 'The Books of the Canon will live here — each one a shelf of entries, chronicles, and vocabulary. Coming in a future sprint.',
    })
  );
  return view;
}
