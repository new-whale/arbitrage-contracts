import { expect } from 'chai';

import { config } from '../../config/klaytn_config';

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
