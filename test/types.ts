import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { BalancerAdapter, IsoAdapter, KlayswapAdapter, UniV2Adapter } from '../src/types/SmartRoute/adapter';
import { RouteProxy } from '../src/types/SmartRoute/proxies';
import { UniV2Viewer, BalancerViewer } from '../src/types/Viewer';

// import type { Greeter } from '../src/types/Greeter';

type Fixture<T> = () => Promise<T>;
declare module 'mocha' {
  export interface Context {
    uniV2Viewer: UniV2Viewer;
    uniV2Adapter: UniV2Adapter;
    balancerViewer: BalancerViewer;
    balancerAdapter: BalancerAdapter;
    klayswapAdapter: KlayswapAdapter;
    isoAdapter: IsoAdapter;
    routeProxy: RouteProxy;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
}
