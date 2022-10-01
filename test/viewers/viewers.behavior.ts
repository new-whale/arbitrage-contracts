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
      const pool2 = await this.uniV2Viewer.getPairInfo(factory, len.sub(1));
      expect(pool1.fees[0]).to.equal(fee);
      expect(pool2.fees[0]).to.equal(fee);
    }
  });
}
