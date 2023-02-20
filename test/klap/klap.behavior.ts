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
    const wusdc = IERC20__factory.connect(config.Klap.WormUSDC, this.signers.admin);

    const dept = ethers.utils.parseEther('1000000');

    console.log('payback 1000000 klay');

    await wklay.deposit({
      value: dept,
    }).then(tx => tx.wait());

    await wklay.approve(config.Klap.LendingPool, dept).then(tx => tx.wait());

    for (const user of config.Klap.KlayDeptUsers) {
      const receipt = await lendingPool.liquidationCall(user.Collat, config.Klap.Wklay, user.Addr, dept, false, {
        gasLimit: 5000000,
      })
        .then(tx => tx.wait());
      console.log('Receipt status: ', receipt.status);
    }

    const usdcBalance = await usdc.balanceOf(this.signers.admin.address);
    console.log('got usdc: ', ethers.utils.formatUnits(usdcBalance, 6));
    const wusdcBalance = await wusdc.balanceOf(this.signers.admin.address);
    console.log('got wusdc: ', ethers.utils.formatUnits(wusdcBalance, 6));
    const wklayBalance = await wklay.balanceOf(this.signers.admin.address);
    console.log('remaining wklay: ', ethers.utils.formatUnits(wklayBalance, 18));

    const x = dept.sub(wklayBalance);
    const y = usdcBalance.add(wusdcBalance);

    console.log(`from ${ethers.utils.formatEther(x)} klay to ${ethers.utils.formatUnits(y, 6)} usdc`);
    const kprice = 338;
    const a = x.mul(kprice).div(1000).div(ethers.utils.parseUnits('1', 12));
    console.log(`profit: ${ethers.utils.formatUnits(y.sub(a), 6)}$`);
  });
}
