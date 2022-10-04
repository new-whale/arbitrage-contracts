import { Signer } from '@ethersproject/abstract-signer';
import { task } from 'hardhat/config';

task('accounts', 'Prints the list of accounts', async (_taskArgs, { ethers }) => {
  const accounts: Array<Signer> = await ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress(), ':', ethers.utils.formatEther(await account.getBalance()));
  }
});
