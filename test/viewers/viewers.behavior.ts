import { expect } from 'chai';
import { ethers } from 'hardhat';

import { config } from '../../config/klaytn_config';
import { IERC20__factory, IPangeaRouter__factory } from '../../src/types';
import { IPangeaFactory__factory } from '../../src/types/factories/IPangeaFactory__factory';

export function fetchUniV2Viewer(): void {
  it('UniV2 fetch pool info of WMATIC-USDC', async function () {
    let k: keyof typeof config.UniV2Factories;
    for (k in config.UniV2Factories) {
      const [factory, fee, wklay] = config.UniV2Factories[k] as [string, number, string];

      const len = await this.uniV2Viewer.allPairsLength(factory);
      // console.log('Dex', v, 'poolNum:', len.toString());
      const pool1 = await this.uniV2Viewer.getPairInfo(factory, 0);
      // console.log('Dex', k, 'pool1:', pool1.pool, pool1.tokenList[0], pool1.tokenList[1]);
      const pool2 = await this.uniV2Viewer.getPairInfo(factory, len.sub(1));
      expect(pool1.fees[0]).to.equal(fee);
      expect(pool2.fees[0]).to.equal(fee);
    }
  });
}

export function fetchBalancerViewer(): void {
  it('Balancer fetch pool info', async function () {
    const pool = config.KlexPools[0];
    const info = await this.balancerViewer.getPoolInfo(pool);

  });
}

export function fetchI4iViewer(): void {
  it('I4i fetch pool infos', async function () {
    const pools = await this.i4iViewer.pools();

    console.log('I4i pools:', pools.length);

    for (const pool of pools) {
      const info = await this.i4iViewer.getPoolInfo(pool);
      console.log(info.name);
    }
  });
}

export function pangea(): void {
  it('Pangea wklay-stone pool', async function () {
    const wklay = '0xFF3e7cf0C007f919807b32b30a4a9E7Bd7Bc4121';

    // oUSDT
    // const usdt = '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167';
    // STONE
    const usdt = '0xb49e754228bc716129e63b1a7b0b6cf27299979e';

    // CONCEN FACTORY
    // const factory = '0x3d94b5e3b83cbd52b9616930d33515613adfad67';
    // MINING FACTORY
    const factory = '0x02d9bf2d4F5cEA981cB8a8B77A56B498C5da7Eb0';
    const factory_ = IPangeaFactory__factory.connect(factory, this.signers.admin);
    const n = (await factory_.poolsCount(wklay, usdt)).toNumber();
    console.log(`pangea has wklay-usdt ${n} pools`);
    const addrs = await factory_.getPools(wklay, usdt, 0, n);
    console.log(`pools: ${addrs}`);

    if (addrs.length != 1) {
      return;
    }

    const router = IPangeaRouter__factory.connect('0x17Ac28a29670e637c8a6E1ec32b38fC301303E34', this.signers.admin);

    const amountIn = ethers.utils.parseEther('1');

    const amountOut = await router.callStatic.exactInputSingle({
    //   tokenIn: wklay,
      tokenIn: '0x0000000000000000000000000000000000000000',
      amountIn: amountIn,
      amountOutMinimum: 0,
      pool: addrs[0],
      to: this.signers.admin.address,
      unwrap: false,
      // tokenIn: PromiseOrValue<string>;
      // amountIn: PromiseOrValue<BigNumberish>;
      // amountOutMinimum: PromiseOrValue<BigNumberish>;
      // path: PromiseOrValue<string>[];
      // to: PromiseOrValue<string>;
      // unwrap: PromiseOrValue<boolean>;
    }, {
      value: amountIn,
    });
    console.log(`out: ${ethers.utils.formatUnits(amountOut, 6)}`);

    const usdtERC = IERC20__factory.connect(usdt, this.signers.admin);
    const targetBalance = await usdtERC.balanceOf(addrs[0]);

    const hunterOut = await this.stoneHunter.callStatic.huntStone(
      wklay,
      usdt,
      targetBalance,
      {
        value: amountIn,
      },
    );
    console.log(`hunterOut: ${ethers.utils.formatUnits(hunterOut, 6)}`);
  });
}
