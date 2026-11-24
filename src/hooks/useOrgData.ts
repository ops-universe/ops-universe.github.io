import { useEffect, useState } from 'react';
import { loadOrgData, type OrgData } from '@/lib/github';

type State = { status: 'loading'; data?: undefined } | { status: 'ready'; data: OrgData };

/** Shared org + repo data. The underlying request is made once per page load. */
export function useOrgData(): State {
  const [state, setState] = useState<State>({ status: 'loading' });
  useEffect(() => {
    let alive = true;
    loadOrgData().then((data) => alive && setState({ status: 'ready', data }));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}
