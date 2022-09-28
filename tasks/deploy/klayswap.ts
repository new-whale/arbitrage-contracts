import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { task } from 'hardhat/config';
import type { TaskArguments } from 'hardhat/types';

import type { Klayswap } from '../../src/types/contracts/Uni2/Klayswap.sol/Klayswap';
import { IERC20__factory } from '../../src/types/factories/@openzeppelin/contracts/token/ERC20/IERC20__factory';
import { Klayswap__factory } from '../../src/types/factories/contracts/Uni2/Klayswap.sol/Klayswap__factory';

task('deploy:Klayswap')
  .addFlag('deploy', 'Whether deploy')
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const [signer]: Array<SignerWithAddress> = await ethers.getSigners();

    console.log(`Wallet addr: ${signer.address}`);

    let klayswap = Klayswap__factory.connect('0xc51682a8d7c52aced34412b6dcfb41acac1d3e2c', signer);
    if (taskArguments.deploy) {
      const klayswapFactory = new Klayswap__factory(signer);
      klayswap = await klayswapFactory.connect(signer).deploy();
      await klayswap.deployed();
    }

    console.log('Contract address: ', klayswap.address);
    const klay = '0x0000000000000000000000000000000000000000';
    const ousdt = '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167';
    const amount = 10000;
    const value = BigNumber.from('1000000000000000000');

    const simRes = await klayswap.swapExactKlay(10, [klay, ousdt], {
      value,
    });
    console.log(`Simulation result: ${simRes}`);

    return;

    const path = [ousdt, klay];
    const amounts = await klayswap.getAmountsOut(amount, path);
    console.log(`getAmountsOut: ${amounts}`);

    const srcToken = IERC20__factory.connect(path[0], signer);
    const allowance = await srcToken.allowance(signer.address, klayswap.address);
    if (allowance.lt(amount)) {
      console.log('Get approved');
      await (await srcToken.approve(klayswap.address, amount)).wait();
    }
    else {
      console.log('No approve needed');
    }
    const newAllowance = await srcToken.allowance(signer.address, klayswap.address);
    console.log(`Allowance ${signer.address}, ${klayswap.address}: ${newAllowance}`);
    const simResult = await klayswap.callStatic.swapExactKct(amount, 10, path);
    console.log(`swapExactKct: ${simResult}`);
  });
