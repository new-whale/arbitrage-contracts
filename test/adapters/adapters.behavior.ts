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
  it('swap 1 oUSDT -> WKLAY', async function () {
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

export function swapI4iAdapter(): void {
  it('swap 1 oUSDT -> oUSDC', async function () {
    const abi = ethers.utils.defaultAbiCoder;

    const ousdtOwner = await ethers.getImpersonatedSigner('0x96BEA8b38a8D558d598770A6babBfc78015823e3');
    const pool = '0xb0Da0BBE0a13C2c17178aEa2fEC91AA08157F299';

    const ousdt = IERC20__factory.connect(config.Tokens.oUSDT.address, ousdtOwner);
    const amountIn = ethers.utils.parseUnits('1', config.Tokens.oUSDT.decimal);
    await (await ousdt.transfer(this.i4iAdapter.address, amountIn)).wait();

    const output = await this.i4iAdapter.callStatic.swapExactIn(
      config.Tokens.oUSDT.address,
      amountIn,
      config.Tokens.oUSDC.address,
      abi.encode(['address', 'uint256', 'uint256'], [pool, 0, 4]),
      ousdtOwner.address,
    );
  });

  it('swap 1 oUSDT -> 4NUTS', async function () {
    const abi = ethers.utils.defaultAbiCoder;

    const ousdtOwner = await ethers.getImpersonatedSigner('0x96BEA8b38a8D558d598770A6babBfc78015823e3');
    const pool = '0xb0Da0BBE0a13C2c17178aEa2fEC91AA08157F299';

    const ousdt = IERC20__factory.connect(config.Tokens.oUSDT.address, ousdtOwner);
    const amountIn = ethers.utils.parseUnits('1', config.Tokens.oUSDT.decimal);
    await (await ousdt.transfer(this.i4iAdapter.address, amountIn)).wait();

    const nuts = IERC20__factory.connect(config.Tokens['4NUTS'].address, ousdtOwner);
    const bef = await nuts.balanceOf(ousdtOwner.address);

    const est = await this.i4iAdapter.callStatic.swapExactIn(
      config.Tokens.oUSDT.address,
      amountIn,
      config.Tokens['4NUTS'].address,
      abi.encode(['address', 'uint256', 'uint256'], [pool, 1, 4]),
      ousdtOwner.address,
    );

    const tx = await this.i4iAdapter.swapExactIn(
      config.Tokens.oUSDT.address,
      amountIn,
      config.Tokens['4NUTS'].address,
      abi.encode(['address', 'uint256', 'uint256'], [pool, 1, 4]),
      ousdtOwner.address,
    );
    await tx.wait();

    const aft = await nuts.balanceOf(ousdtOwner.address);
    const diff = aft.sub(bef);

    expect(est).be.equal(diff);
  });

  it('swap 4NUTS -> oUSDT', async function () {
    const abi = ethers.utils.defaultAbiCoder;

    const nutsOwner = await ethers.getImpersonatedSigner('0x96BEA8b38a8D558d598770A6babBfc78015823e3');
    const pool = '0xb0Da0BBE0a13C2c17178aEa2fEC91AA08157F299';

    const nuts = IERC20__factory.connect(config.Tokens['4NUTS'].address, nutsOwner);
    const ousdt = IERC20__factory.connect(config.Tokens.oUSDT.address, nutsOwner);

    const amountIn = ethers.utils.parseUnits('0.9', config.Tokens['4NUTS'].decimal);
    await (await nuts.transfer(this.i4iAdapter.address, amountIn)).wait();

    const bef = await ousdt.balanceOf(nutsOwner.address);

    const est = await this.i4iAdapter.callStatic.swapExactIn(
      config.Tokens['4NUTS'].address,
      amountIn,
      config.Tokens.oUSDT.address,
      abi.encode(['address', 'uint256', 'uint256'], [pool, 2, 4]),
      nutsOwner.address,
    );

    const tx = await this.i4iAdapter.swapExactIn(
      config.Tokens['4NUTS'].address,
      amountIn,
      config.Tokens.oUSDT.address,
      abi.encode(['address', 'uint256', 'uint256'], [pool, 2, 4]),
      nutsOwner.address,
    );
    await tx.wait();

    const aft = await ousdt.balanceOf(nutsOwner.address);
    const diff = aft.sub(bef);

    expect(est).be.equal(diff);
  });
}

export function swapRouteProxy(): void {
  it('swap 1 KLAY -> oUSDT through RouteProxy', async function () {
    const abi = ethers.utils.defaultAbiCoder;

    const klayOwner = await ethers.getImpersonatedSigner('0x96BEA8b38a8D558d598770A6babBfc78015823e3');
    const ousdt = IERC20__factory.connect(config.Tokens.oUSDT.address, klayOwner);

    const swap1_step1: MultiAMMLib.SwapStruct = {
      fromToken: config.Tokens.KLAY.address,
      toToken: config.Tokens.oUSDT.address,
      moreInfo: abi.encode(['address[]'], [[]]),
      adapter: this.klayswapAdapter.address,
      recipient: this.klayswapAdapter.address,
    };

    const swap1_step2: MultiAMMLib.SwapStruct = {
      fromToken: config.Tokens.oUSDT.address,
      toToken: config.UniV2Factories.Claimswap[2] as string,
      moreInfo: abi.encode(['address'], ['0x5AD1139C1A45E6f881A30638F824EfE2176d3624']),
      adapter: this.uniV2Adapter.address,
      recipient: '0x5AD1139C1A45E6f881A30638F824EfE2176d3624',
    };

    const swap1_step3: MultiAMMLib.SwapStruct = {
      fromToken: config.UniV2Factories.Claimswap[2] as string,
      toToken: config.UniV2Factories.Definix[2] as string,
      moreInfo: abi.encode([], []),
      adapter: this.isoAdapter.address,
      recipient: this.isoAdapter.address,
    };

    const swap1_step4: MultiAMMLib.SwapStruct = {
      fromToken: config.UniV2Factories.Definix[2] as string,
      toToken: config.Tokens.oUSDT.address,
      moreInfo: abi.encode(['address'], ['0xcCCd396490e84823Ad17ab9781476a17150AD8e2']),
      adapter: this.uniV2Adapter.address,
      recipient: '0xcCCd396490e84823Ad17ab9781476a17150AD8e2',
    };

    const swap1 = [swap1_step1, swap1_step2, swap1_step3, swap1_step4];

    const beforeBalance = await ousdt.balanceOf(klayOwner.address);

    const staticOutput = await this.routeProxy.callStatic.splitSwap(
      config.Tokens.KLAY.address,
      ethers.utils.parseEther('1'),
      config.Tokens.oUSDT.address,
      klayOwner.address,
      [1],
      [
        swap1,
      ],
      ethers.utils.parseUnits('0.1', config.Tokens.oUSDT.decimal),
      '0xfffffffffffff',
      {
        value: ethers.utils.parseEther('1'),
      },
    );

    const output = await this.routeProxy.callStatic.getSplitSwapOut(
      config.Tokens.KLAY.address,
      ethers.utils.parseEther('1'),
      config.Tokens.oUSDT.address,
      [1],
      [
        swap1,
      ],
    );

    const tx = await this.routeProxy.splitSwap(
      config.Tokens.KLAY.address,
      ethers.utils.parseEther('1'),
      config.Tokens.oUSDT.address,
      klayOwner.address,
      [1],
      [
        swap1,
      ],
      ethers.utils.parseUnits('0.1', config.Tokens.oUSDT.decimal),
      '0xfffffffffffff',
      {
        value: ethers.utils.parseEther('1'),
      },
    );
    await tx.wait();

    const afterBalance = await ousdt.balanceOf(klayOwner.address);

    // console.log('Before:', ethers.utils.formatUnits(beforeBalance, config.Tokens.oUSDT.decimal));
    // console.log('After :', ethers.utils.formatUnits(afterBalance, config.Tokens.oUSDT.decimal));
    expect(afterBalance.sub(beforeBalance)).be.equal(output);
    expect(afterBalance.sub(beforeBalance)).be.equal(staticOutput);
  });
}
