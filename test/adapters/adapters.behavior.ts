import { expect } from 'chai';
import { ethers } from 'hardhat';

import { config } from '../../config/klaytn_config';
import { IERC20__factory } from '../../src/types/factories/intf';

export function swapKlayswapAdapter(): void {
  it('swap 1 KLAY -> kDAI -> MBX -> oUSDT', async function () {
    const abi = ethers.utils.defaultAbiCoder;

    const output = await this.klayswapAdapter.callStatic.swapExactIn(
      config.Tokens.KLAY.address,
      ethers.utils.parseUnits('1', config.Tokens.KLAY.decimal),
      config.Tokens.oUSDT.address,
      abi.encode(['address[]'], [[config.Tokens.kDAI.address, config.Tokens.MBX.address]]),
      this.signers.admin.address,
      {
        value: ethers.utils.parseUnits('1', config.Tokens.KLAY.decimal),
      },
    );

    console.log('oUSDT:', ethers.utils.formatUnits(output, config.Tokens.oUSDT.decimal));
  });
}

export function swapUniV2Adapter(): void {
  it('swap 1 WKLAY -> oUSDT', async function () {
    const abi = ethers.utils.defaultAbiCoder;

    const ousdtOwner = await ethers.getImpersonatedSigner('0x96BEA8b38a8D558d598770A6babBfc78015823e3');
    const pool = '0xcCCd396490e84823Ad17ab9781476a17150AD8e2';

    const ousdt = IERC20__factory.connect(config.Tokens.oUSDT.address, ousdtOwner);
    const amountIn = ethers.utils.parseUnits('1', config.Tokens.oUSDT.decimal);
    await (await ousdt.transfer(pool, amountIn)).wait();

    const output = await this.uniV2Adapter.callStatic.swapExactIn(
      config.Tokens.oUSDT.address,
      amountIn,
      config.UniV2Factories.Definix[2] as string,
      abi.encode(['address'], [pool]),
      ousdtOwner.address,
    );

    console.log('wklay:', ethers.utils.formatUnits(output, config.Tokens.KLAY.decimal));
  });
}

export function swapBalancerAdapter(): void {
  it('swap 1 WKLAY -> oUSDT', async function () {
    const abi = ethers.utils.defaultAbiCoder;

    const ousdtOwner = await ethers.getImpersonatedSigner('0x96BEA8b38a8D558d598770A6babBfc78015823e3');
    const pool = config.KlexPools[0];

    const ousdt = IERC20__factory.connect(config.Tokens.oUSDT.address, ousdtOwner);
    const amountIn = ethers.utils.parseUnits('1', config.Tokens.oUSDT.decimal);
    await (await ousdt.transfer(this.balancerAdapter.address, amountIn)).wait();

    const output = await this.balancerAdapter.callStatic.swapExactIn(
      config.Tokens.oUSDT.address,
      amountIn,
      '0xe4f05A66Ec68B54A58B17c22107b02e0232cC817',
      abi.encode(['address'], [pool]),
      ousdtOwner.address,
    );

    console.log('wklay:', ethers.utils.formatUnits(output, config.Tokens.KLAY.decimal));
  });
}
