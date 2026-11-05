import { useSyncExternalStore } from 'react';

export interface AppLocation {
  pathname: string;
  search: string;
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('popstate', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('popstate', listener);
  };
}

function getSnapshot() {
  return window.location.href;
}

export function useLocation(): AppLocation {
  const href = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const { pathname, search } = new URL(href);
  return { pathname, search };
}

export function navigate(to: string) {
  window.history.pushState({}, '', to);
  listeners.forEach((listener) => listener());
  window.scrollTo({ top: 0 });
}
