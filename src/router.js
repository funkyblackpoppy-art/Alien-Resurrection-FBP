// Black Poppy Canon — hash router
// Routes map #/path → view module. Hash routing keeps the app
// deployable on any static host with zero server configuration.

import { DashboardView } from './views/dashboard.js';
import { LibraryView } from './views/library.js';
import { AtelierView } from './views/atelier.js';
import { SearchView } from './views/search.js';
import { SettingsView } from './views/settings.js';
import { NotFoundView } from './views/notfound.js';

export const routes = [
  { path: '/',         title: 'Dashboard', view: DashboardView, nav: 'Dashboard' },
  { path: '/library',  title: 'Library',   view: LibraryView,   nav: 'Library' },
  { path: '/atelier',  title: 'Atelier',   view: AtelierView,   nav: 'Atelier' },
  { path: '/search',   title: 'Search',    view: SearchView,    nav: 'Search' },
  { path: '/settings', title: 'Settings',  view: SettingsView,  nav: 'Settings' },
];

const notFound = { path: null, title: 'Not Found', view: NotFoundView };

function currentPath() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return hash.split('?')[0];
}

export function initRouter({ outlet, onNavigate }) {
  function render() {
    const path = currentPath();
    const route = routes.find((r) => r.path === path) || notFound;

    outlet.innerHTML = '';
    outlet.appendChild(route.view());
    onNavigate(route.path ? route : { ...notFound, path });
  }

  window.addEventListener('hashchange', render);
  render();
}

export function navigate(path) {
  window.location.hash = `#${path}`;
}
