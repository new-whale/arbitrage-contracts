import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { task } from 'hardhat/config';
import type { TaskArguments } from 'hardhat/types';

import type { Claimswap } from '../../src/types/contracts/Uni2/Claimswap.sol/Claimswap';
import { IERC20__factory } from '../../src/types/factories/@openzeppelin/contracts/token/ERC20/IERC20__factory';
import { Claimswap__factory } from '../../src/types/factories/contracts/Uni2/Claimswap.sol/Claimswap__factory';

task('deploy:Claimswap')
  .addFlag('deploy', 'Whether deploy')
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const [signer]: Array<SignerWithAddress> = await ethers.getSigners();

    console.log(`Wallet addr: ${signer.address}`);

    let claimswap = Claimswap__factory.connect('0xc51682a8d7c52aced34412b6dcfb41acac1d3e2c', signer);
    if (taskArguments.deploy) {
      const claimswapFactory = new Claimswap__factory(signer);
      claimswap = await claimswapFactory.connect(signer).deploy();
      await claimswap.deployed();
    }

    console.log('Contract address: ', claimswap.address);
    const klay = '0x0000000000000000000000000000000000000000';
    const ousdt = '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167';
    const amount = 10000;
    const value = BigNumber.from('1000000000000000000');

    const simRes = await claimswap.callStatic.swapExactKlay(10, [klay, ousdt], {
      value,
    });
    console.log(`Simulation result: ${simRes}`);

    const path = [ousdt, klay];
    const amounts = await claimswap.getAmountsOut(amount, path);
    console.log(`getAmountsOut: ${amounts}`);

    const srcToken = IERC20__factory.connect(path[0], signer);
    const allowance = await srcToken.allowance(signer.address, claimswap.address);
    if (allowance.lt(amount)) {
      console.log('Get approved');
      await (await srcToken.approve(claimswap.address, amount)).wait();
    }
    else {
      console.log('No approve needed');
    }
    const newAllowance = await srcToken.allowance(signer.address, claimswap.address);
    console.log(`Allowance ${signer.address}, ${claimswap.address}: ${newAllowance}`);
    const simResult = await claimswap.callStatic.swapExactKct(amount, 10, path);
    console.log(`swapExactKct: ${simResult}`);
  });
