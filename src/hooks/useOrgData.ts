import { useEffect, useState } from 'react';
import { loadOrgData, snapshot, type OrgData } from '@/lib/github';

type State = { status: 'loading'; data?: undefined } | { status: 'ready'; data: OrgData };

/** Shared org + repo data. The underlying request is made once per page load. */
export function useOrgData(): State {
  // Prerendered pages are built from the snapshot so crawlers and no-JS readers see
  // real repository content; in the browser the live request runs as before.
  const [state, setState] = useState<State>(() =>
    import.meta.env.SSR
      ? { status: 'ready', data: { org: snapshot.org, repos: snapshot.repos, source: 'snapshot', fetchedAt: snapshot.fetchedAt } }
      : { status: 'loading' },
  );
  useEffect(() => {
    let alive = true;
    loadOrgData().then((data) => alive && setState({ status: 'ready', data }));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}
