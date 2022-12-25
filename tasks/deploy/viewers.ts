import { task } from 'hardhat/config';
import type { TaskArguments } from 'hardhat/types';

import { config } from '../../config/klaytn_config';
import type {
  TokenViewer,
  UniV2Viewer,
} from '../../src/types/Viewer';
import {
  BalancerViewer__factory,
  I4IViewer__factory,
  TokenViewer__factory,
  UniV2Viewer__factory,
} from '../../src/types/factories/Viewer';
import { StoneHunter__factory } from '../../src/types/factories/StoneHunter__factory';

task('deploy:Viewers').setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const [signer] = await ethers.getSigners();

  const uniV2ViewerFactory: UniV2Viewer__factory = new UniV2Viewer__factory(signer);
  const uniV2Viewer: UniV2Viewer = await uniV2ViewerFactory.deploy(
    Object.values(config.UniV2Factories).map(x => x[0] as string),
    Object.values(config.UniV2Factories).map(x => x[1] as number),
  );
  await uniV2Viewer.deployed();
  console.log('UniV2Viewer deployed to: ', uniV2Viewer.address);

  const balancerViewerFactory = new BalancerViewer__factory(signer);
  const balancerViewer = await balancerViewerFactory.deploy();
  await balancerViewer.deployed();
  console.log('BalancerViewer deployed to: ', balancerViewer.address);

  const i4iViewerFactory = new I4IViewer__factory(signer);
  const i4iViewer = await i4iViewerFactory.deploy(config.I4IPoolRegistry);
  await i4iViewer.deployed();
  console.log('I4iViewer deployed to:', i4iViewer.address);

  const tokenViewerFactory = new TokenViewer__factory(signer);
  const tokenViewer: TokenViewer = await tokenViewerFactory.connect(signer).deploy();
  await tokenViewer.deployed();
  console.log('TokenViewer deployed to: ', tokenViewer.address);

//   const stoneHunterFactory = new StoneHunter__factory(signer);
//   const stoneHunter = await stoneHunterFactory.deploy();
//   await stoneHunter.deployed();
//   console.log('StoneHunter:', stoneHunter.address);
});
