import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { task } from 'hardhat/config';
import type { TaskArguments } from 'hardhat/types';

import type { Paladex } from '../../src/types/contracts/Uni2/Paladex.sol/Paladex';
import { IERC20__factory } from '../../src/types/factories/@openzeppelin/contracts/token/ERC20/IERC20__factory';
import { Paladex__factory } from '../../src/types/factories/contracts/Uni2/Paladex.sol/Paladex__factory';

task('deploy:Paladex')
  .addFlag('deploy', 'Whether deploy')
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const [signer]: Array<SignerWithAddress> = await ethers.getSigners();

    let paladex: Paladex | undefined = undefined;
    if (taskArguments.deploy) {
      const paladexFactory = new Paladex__factory(signer);
      paladex = await paladexFactory.connect(signer).deploy();
      await paladex.deployed();
    }
    else {
      paladex = Paladex__factory.connect('0xd1286716B4A91b5dA85759260be1FB24724E50D4', signer);
    }
    console.log('Contract address: ', paladex.address);
    const klay = '0x0000000000000000000000000000000000000000';
    const ousdt = '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167';
    const amount = 10000;
    const value = BigNumber.from('1000000000000000000');

    const simRes = await paladex.callStatic.swapExactKlay(10, [klay, ousdt], {
      value,
    });
    console.log(`Simulation result: ${simRes}`);

    const path = [ousdt, klay];
    const amounts = await paladex.getAmountsOut(amount, path);
    console.log(`getAmountsOut: ${amounts}`);

    const srcToken = IERC20__factory.connect(path[0], signer);
    const allowance = await srcToken.allowance(signer.address, paladex.address);
    if (allowance.lt(amount)) {
      console.log('Get approved');
      await (await srcToken.approve(paladex.address, amount)).wait();
    }
    else {
      console.log('No approve needed');
    }
    const newAllowance = await srcToken.allowance(signer.address, paladex.address);
    console.log(`Allowance ${signer.address}, ${paladex.address}: ${newAllowance}`);
    const simResult = await paladex.callStatic.swapExactKct(amount, 10, path);
    console.log(`swapExactKct: ${simResult}`);
  });
