import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { UniV2Viewer } from '../src/types/Viewer';

// import type { Greeter } from '../src/types/Greeter';

type Fixture<T> = () => Promise<T>;
declare module 'mocha' {
  export interface Context {
    uniV2Viewer: UniV2Viewer;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
}
