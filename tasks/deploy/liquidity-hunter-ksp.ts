import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { IERC20__factory } from "../../src/types/factories/@openzeppelin/contracts/token/ERC20/IERC20__factory";
import { LiquidityHunterKsp__factory } from "../../src/types/factories/contracts/LiquidityHunterKsp.sol/LiquidityHunterKsp__factory";

task("deploy:LiquidityHunterKsp")
  .addFlag("deploy", "Whether deploy")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const [signer]: SignerWithAddress[] = await ethers.getSigners();

    console.log(`Wallet addr: ${signer.address}`);

    let liquidityHunter = LiquidityHunterKsp__factory.connect("0x17213866d7C01cE3Ae829824983bB6bAD0fdba58", signer);
    // let liquidityHunter = LiquidityHunterKsp__factory.connect("0xf07287C4d8a0d3D828C989c7F62EFC2DDa9E7cD8", signer);
    if (taskArguments.deploy) {
      const liquidityHunterFactory = new LiquidityHunterKsp__factory(signer);
      liquidityHunter = await liquidityHunterFactory.connect(signer).deploy();
      await liquidityHunter.deployed();
    }
    console.log(`Contract addr: ${liquidityHunter.address}`);

    const amountIn = BigNumber.from(10).pow(6);

    const ousdtERC20 = IERC20__factory.connect("0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167", signer);
    const balance = await ousdtERC20.balanceOf(signer.address);
    console.log(`ousdt balance: ${balance}`);

    const daiERC20 = IERC20__factory.connect("0x5c74070fdea071359b86082bd9f9b3deaafbe32b", signer);
    const allowance = await ousdtERC20.allowance(signer.address, liquidityHunter.address);

    console.log(`allowance ${allowance}`);
    if (allowance.lt(amountIn)) {
      const tx = await ousdtERC20.approve(liquidityHunter.address, BigNumber.from(2).pow(200));
      await tx.wait();
    }

    const priceNumer = BigNumber.from(1);
    const priceDenom = BigNumber.from(10).pow(12);

    const amountOut = await liquidityHunter.callStatic.buyToken(
      daiERC20.address,
      ousdtERC20.address,
      signer.address,
      signer.address,
      priceNumer,
      priceDenom,
      amountIn,
      {
        gasLimit: 3000000,
      },
    );

    console.log(`From ${amountIn} To ${amountOut}`);
  });
