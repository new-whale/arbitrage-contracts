import { ethers } from 'hardhat';

import { config } from '../../config/klaytn_config';
import type {
  BalancerViewer,
  CurveCryptoViewer,
  CurveViewer,
  I4IViewer,
  StableSwapViewer,
  TokenViewer,
  UniV2Viewer,
  UniV3Viewer,
} from '../../src/types/Viewer';
import {
  BalancerViewer__factory,
  CurveCryptoViewer__factory,
  CurveViewer__factory,
  I4IViewer__factory,
  StableSwapViewer__factory,
  TokenViewer__factory,
  UniV2Viewer__factory,
  UniV3Viewer__factory,
} from '../../src/types/factories/Viewer';

export async function deployViewersFixture(): Promise<{
  balancerViewer: BalancerViewer;
  // curveViewer: CurveViewer;
  // curveCryptoViewer: CurveCryptoViewer;
  uniV2Viewer: UniV2Viewer;
  i4iViewer: I4IViewer;
  // uniV3Viewer: UniV3Viewer;
  // stableSwapViewer: StableSwapViewer;
  // tokenViewer: TokenViewer;
}> {
  const [signer] = await ethers.getSigners();

  const uniV2ViewerFactory: UniV2Viewer__factory = new UniV2Viewer__factory(signer);
  const uniV2Viewer: UniV2Viewer = await uniV2ViewerFactory.deploy(
    Object.values(config.UniV2Factories).map(x => x[0] as string),
    Object.values(config.UniV2Factories).map(x => x[1] as number),
    // ['0x3679c3766E70133Ee4A7eb76031E49d3d1f2B50c'], [3000],
  );
  await uniV2Viewer.deployed();
  console.log('UniV2Viewer: ', uniV2Viewer.address);

  const balancerViewerFactory = new BalancerViewer__factory(signer);
  const balancerViewer = await balancerViewerFactory.deploy();
  await balancerViewer.deployed();
  console.log('BalancerViewer: ', balancerViewer.address);

  const i4iViewerFactory = new I4IViewer__factory(signer);
  const i4iViewer = await i4iViewerFactory.deploy(config.I4IPoolRegistry);
  await i4iViewer.deployed();
  console.log('I4iViewer:', i4iViewer.address);

  return {
    uniV2Viewer,
    balancerViewer,
    i4iViewer,
  };
}
