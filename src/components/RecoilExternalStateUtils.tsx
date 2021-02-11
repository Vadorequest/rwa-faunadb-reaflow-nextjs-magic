import {
  Loadable,
  RecoilState,
  RecoilValue,
  useRecoilCallback,
  useRecoilTransactionObserver_UNSTABLE,
} from 'recoil';

export let RecoilGetLoadable: <T>(
  recoilValue: RecoilValue<T>,
) => Loadable<T> = null as any;

export let RecoilSet: <T>(
  recoilVal: RecoilState<T>,
  valOrUpdater: ((currVal: T) => T) | T,
) => void = () => null as any;

export function RecoilUtilsComponent() {
  // We need to update the RecoilGetLoadable every time there's a new snapshot
  // Otherwise we will load old values from when the component was mounted
  useRecoilTransactionObserver_UNSTABLE(({ snapshot }) => {
    RecoilGetLoadable = snapshot.getLoadable;
  });

  // We only need to assign RecoilSet once because it's not temporally dependent like get is
  useRecoilCallback(({ set }) => {
    RecoilSet = set;

    return async () => {

    };
  })();

  return <></>;
}
