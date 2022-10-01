import { ethers } from 'hardhat';
import { config } from '../../config/klaytn_config';
import type {
  KlayswapAdapter,
  UniV2Adapter,
} from '../../src/types/SmartRoute/adapter';
import {
  KlayswapAdapter__factory,
  UniV2Adapter__factory,
} from '../../src/types/factories/SmartRoute/adapter';
import { UniV2Viewer__factory } from '../../src/types/factories/Viewer';
import { UniV2Viewer } from '../../src/types/Viewer';

export async function deployAdaptersFixture(): Promise<{
  uniV2Adapter: UniV2Adapter;
  klayswapAdapter: KlayswapAdapter;
}> {
  const [signer] = await ethers.getSigners();

  const uniV2ViewerFactory: UniV2Viewer__factory = new UniV2Viewer__factory(signer);
  const uniV2Viewer: UniV2Viewer = await uniV2ViewerFactory.deploy(
    Object.values(config.UniV2Factories).map(x => x[0] as string),
    Object.values(config.UniV2Factories).map(x => x[1] as number),
    // ['0x3679c3766E70133Ee4A7eb76031E49d3d1f2B50c'], [3000],
  );
  await uniV2Viewer.deployed();

  const uniV2AdapterFactory = new UniV2Adapter__factory(signer);
  const uniV2Adapter = await uniV2AdapterFactory.deploy(uniV2Viewer.address);
  await uniV2Adapter.deployed();

  const klayswapAdapterFactory = new KlayswapAdapter__factory(signer);
  const klayswapAdapter = await klayswapAdapterFactory.deploy(config.UniV2Factories.Klayswap[0] as string);
  await klayswapAdapter.deployed();

  return {
    uniV2Adapter,
    klayswapAdapter,
  };
}
