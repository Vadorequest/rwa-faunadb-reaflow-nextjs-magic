import { RecoilRoot } from 'recoil';
import '../utils/wdyr';

// @ts-ignore
export default function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
