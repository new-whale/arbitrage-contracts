import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { IERC20__factory } from "../../src/types/factories/@openzeppelin/contracts/token/ERC20/IERC20__factory";
import { LiquidityHunter__factory } from "../../src/types/factories/contracts/LiquidityHunter__factory";
import { IWKLAY__factory } from "../../src/types/factories/contracts/interface/IWKLAY__factory";

task("deploy:LiquidityHunter")
  .addFlag("deploy", "Whether deploy")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const [signer]: SignerWithAddress[] = await ethers.getSigners();

    console.log(`Wallet addr: ${signer.address}`);

    let liquidityHunter = LiquidityHunter__factory.connect("0x5aF7823C130F6f552d4DB0d9D75927D36F360fba", signer);
    if (taskArguments.deploy) {
      const liquidityHunterFactory = new LiquidityHunter__factory(signer);
      liquidityHunter = await liquidityHunterFactory.connect(signer).deploy();
      await liquidityHunter.deployed();
    }
    console.log(`Contract addr: ${liquidityHunter.address}`);

    const wklay = IWKLAY__factory.connect("0xe4f05A66Ec68B54A58B17c22107b02e0232cC817", signer);
    let balance = await wklay.balanceOf(signer.address);
    const amountIn = BigNumber.from(10).pow(18);
    if (balance.lt(amountIn)) {
      const tx = await wklay.deposit({
        value: amountIn.sub(balance),
      });
      await tx.wait();
      balance = await wklay.balanceOf(signer.address);
    }
    console.log(`Wklay balance: ${balance}`);

    const wklayERC20 = IERC20__factory.connect(wklay.address, signer);
    const usdtERC20 = IERC20__factory.connect("0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167", signer);
    const allowance = await wklayERC20.allowance(signer.address, liquidityHunter.address);
    if (allowance.lt(amountIn)) {
      const tx = await wklayERC20.approve(liquidityHunter.address, BigNumber.from(2).pow(200));
      await tx.wait();
    }

    const priceNumer = BigNumber.from(10).pow(12).mul(39);
    const priceDenom = BigNumber.from(10);

    const amountOut = await liquidityHunter.callStatic.buyToken(
      usdtERC20.address,
      wklayERC20.address,
      signer.address,
      signer.address,
      priceNumer,
      priceDenom,
      0,
      {
        gasLimit: 3000000,
      },
    );

    console.log(`From ${amountIn} To ${amountOut}`);
  });
