import { expect } from 'chai';
import { ethers } from 'hardhat';

import { config } from '../../config/klaytn_config';
import { IERC20__factory } from '../../src/types/factories/intf';
import { MultiAMMLib } from '../../src/types/SmartRoute/proxies/RouteProxy';

export function swapKlayswapAdapter(): void {
  it('swap 1 KLAY -> kDAI -> MBX -> oUSDT', async function () {
    const abi = ethers.utils.defaultAbiCoder;

    const klayOwner = await ethers.getImpersonatedSigner('0x96BEA8b38a8D558d598770A6babBfc78015823e3');
    const amountIn = ethers.utils.parseEther('1');

    const deposit = await klayOwner.sendTransaction({
      to: this.klayswapAdapter.address,
      value: amountIn,
    });
    await deposit.wait();

    const output = await this.klayswapAdapter.callStatic.swapExactIn(
      config.Tokens.KLAY.address,
      amountIn,
      config.Tokens.oUSDT.address,
      abi.encode(['address[]'], [[config.Tokens.kDAI.address, config.Tokens.MBX.address]]),
      this.signers.admin.address,
    );

    console.log('oUSDT:', ethers.utils.formatUnits(output, config.Tokens.oUSDT.decimal));
  });
}

export function swapIsoAdapter(): void {
  it('swap 1 KLAY -> 1 WKLAY(CLA)', async function () {
    const abi = ethers.utils.defaultAbiCoder;

    const klayOwner = await ethers.getImpersonatedSigner('0x96BEA8b38a8D558d598770A6babBfc78015823e3');
    const amountIn = ethers.utils.parseEther('1');

    const deposit = await klayOwner.sendTransaction({
      to: this.isoAdapter.address,
      value: amountIn,
    });
    await deposit.wait();

    const output = await this.isoAdapter.callStatic.swapExactIn(
      config.Tokens.KLAY.address,
      amountIn,
        config.UniV2Factories.Claimswap[2] as string,
        abi.encode([], []),
        klayOwner.address,
    );

    expect(output).be.equal(amountIn);
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

export function swapRouteProxy(): void {
  it('swap 1 KLAY -> oUSDT', async function () {
    const abi = ethers.utils.defaultAbiCoder;

    const klayOwner = await ethers.getImpersonatedSigner('0x96BEA8b38a8D558d598770A6babBfc78015823e3');

    const swap1_step1: MultiAMMLib.SwapStruct = {
      fromToken: config.Tokens.KLAY.address,
      toToken: config.Tokens.oUSDT.address,
      moreInfo: abi.encode(['address[]'], [[]]),
      adapter: this.klayswapAdapter.address,
      recipient: this.klayswapAdapter.address,
    };

    const output = await this.routeProxy.callStatic.splitSwap(
      config.Tokens.KLAY.address,
      ethers.utils.parseEther('1'),
      config.Tokens.oUSDT.address,
      klayOwner.address,
      [1],
      [
        [swap1_step1],
      ],
      ethers.utils.parseUnits('0.1', config.Tokens.oUSDT.decimal),
      '0xfffffffffffff',
      {
        value: ethers.utils.parseEther('1'),
      },
    );

    console.log('oUSDT:', ethers.utils.formatUnits(output, config.Tokens.oUSDT.decimal));
  });
}
