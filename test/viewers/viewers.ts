import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { ethers } from 'hardhat';

import type { Signers } from '../types';
import { fetchUniV2Viewer } from './viewers.behavior';
import { deployViewersFixture } from './viewers.fixtures';

describe('Unit tests', function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: Array<SignerWithAddress> = await ethers.getSigners();
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe('Viewers', function () {
    beforeEach(async function () {
      const { uniV2Viewer } = await this.loadFixture(deployViewersFixture);
      this.uniV2Viewer = uniV2Viewer;
    });

    // fetchBalancerViewer();
    // fetchCurveViewer();
    // fetchCurveCryptoViewer();
    fetchUniV2Viewer();
    // fetchUniV3Viewer();
    // fetchTokenViewer();
  });
});
