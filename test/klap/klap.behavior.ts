import { expect } from 'chai';
import { ethers } from 'hardhat';

import { config } from '../../config/klaytn_config';
import { IERC20__factory, IWETH__factory } from '../../src/types/factories/intf';
import { ILendingPool__factory } from '../../src/types/factories/klap';

export function liquidateKlap(): void {
  it('klap', async function () {
    const lendingPool = ILendingPool__factory.connect(config.Klap.LendingPool, this.signers.admin);
    const wklay = IWETH__factory.connect(config.Klap.Wklay, this.signers.admin);
    const usdc = IERC20__factory.connect(config.Klap.USDC, this.signers.admin);

    const dept = ethers.utils.parseEther('5000');

    console.log('payback 5000 klay');

    await wklay.deposit({
      value: dept,
    }).then(tx => tx.wait());

    await wklay.approve(config.Klap.LendingPool, dept).then(tx => tx.wait());

    const receipt = await lendingPool.liquidationCall(config.Klap.USDC, config.Klap.Wklay, config.Klap.User, dept, false, {
      gasLimit: 5000000,
    })
      .then(tx => tx.wait());

    console.log('Receipt status: ', receipt.status);

    const usdcBalance = await usdc.balanceOf(this.signers.admin.address);
    console.log('got usdc: ', ethers.utils.formatUnits(usdcBalance, 6));
  });
}
