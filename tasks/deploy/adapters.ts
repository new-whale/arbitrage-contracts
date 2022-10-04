import { task } from 'hardhat/config';
import type { TaskArguments } from 'hardhat/types';

import { config } from '../../config/klaytn_config';
import { BalancerAdapter__factory, IsoAdapter__factory, KlayswapAdapter__factory, UniV2Adapter__factory } from '../../src/types/factories/SmartRoute/adapter';
import { RouteProxy__factory } from '../../src/types/factories/SmartRoute/proxies';

task('deploy:Adapters').setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const [signer] = await ethers.getSigners();

  const uniV2AdapterFactory = new UniV2Adapter__factory(signer);
  const uniV2Adapter = await uniV2AdapterFactory.deploy(config.UniV2Viewer);
  await uniV2Adapter.deployed();
  console.log('UniV2Adapter deployed to: ', uniV2Adapter.address);

  const klayswapAdapterFactory = new KlayswapAdapter__factory(signer);
  const klayswapAdapter = await klayswapAdapterFactory.deploy(config.UniV2Factories.Klayswap[0] as string);
  await klayswapAdapter.deployed();
  console.log('KlayswapAdapter deployed to: ', klayswapAdapter.address);

  const isoAdapterFactory = new IsoAdapter__factory(signer);
  const isoAdapter = await isoAdapterFactory.deploy();
  await isoAdapter.deployed();
  console.log('IsoAdapter deployed to: ', isoAdapter.address);

  const balancerAdapterFactory = new BalancerAdapter__factory(signer);
  const balancerAdapter = await balancerAdapterFactory.deploy();
  await balancerAdapter.deployed();
  console.log('BalancerAdapter deployed to: ', balancerAdapter.address);

  const routeProxyFactory = new RouteProxy__factory(signer);
  const routeProxy = await routeProxyFactory.deploy();
  await routeProxy.deployed();
  console.log('RouteProxy deployed to: ', routeProxy.address);
});
