import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { ethers } from 'hardhat';

import type { Signers } from '../types';
import { liquidateKlap } from './klap.behavior';

describe('Unit tests', function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: Array<SignerWithAddress> = await ethers.getSigners();
    this.signers.admin = signers[0];

    this.loadFixture = loadFixture;
  });

  describe('Klap liquidation', function () {
    liquidateKlap();
  });
});
