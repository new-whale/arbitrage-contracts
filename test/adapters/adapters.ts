import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { ethers } from 'hardhat';

import type { Signers } from '../types';
import { swapKlayswapAdapter, swapUniV2Adapter } from './adapters.behavior';
import { deployAdaptersFixture } from './adapters.fixtures';

describe('Unit tests', function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: Array<SignerWithAddress> = await ethers.getSigners();
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe('Adapters', function () {
    beforeEach(async function () {
      const { uniV2Adapter, klayswapAdapter } = await this.loadFixture(deployAdaptersFixture);
      this.uniV2Adapter = uniV2Adapter;
      this.klayswapAdapter = klayswapAdapter;
    });

    swapKlayswapAdapter();
    swapUniV2Adapter();
  });
});
