import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { Neuronswap } from "../../src/types/contracts/Uni2/Neuronswap.sol/Neuronswap";
import { IERC20__factory } from "../../src/types/factories/@openzeppelin/contracts/token/ERC20/IERC20__factory";
import { Neuronswap__factory } from "../../src/types/factories/contracts/Uni2/Neuronswap.sol/Neuronswap__factory";

task("deploy:Neuronswap")
  .addFlag("deploy", "Whether deploy")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const [signer]: Array<SignerWithAddress> = await ethers.getSigners();

    let neuronswap: Neuronswap | undefined = undefined;
    if (taskArguments.deploy) {
      const neuronswapFactory = new Neuronswap__factory(signer);
      neuronswap = await neuronswapFactory.connect(signer).deploy();
      await neuronswap.deployed();
    } else {
      neuronswap = Neuronswap__factory.connect("0x880E6f7E82584200daba1269f9F1EB82d05f6479", signer);
    }
    console.log("Contract address: ", neuronswap.address);
    const klay = "0x0000000000000000000000000000000000000000";
    const nr = "0x340073962a8561cb9e0c271aab7e182d5f5af5c8";
    const amount = BigNumber.from("1000000000000000000");
    const value = BigNumber.from("1000000000000000000");

    const simRes = await neuronswap.callStatic.swapExactKlay(10, [klay, nr], {
      value,
    });
    console.log(`Simulation result: ${simRes}`);

    const path = [nr, klay];
    const amounts = await neuronswap.getAmountsOut(amount, path);
    console.log(`getAmountsOut: ${amounts}`);

    const srcToken = IERC20__factory.connect(path[0], signer);
    const allowance = await srcToken.allowance(signer.address, neuronswap.address);
    if (allowance.lt(amount)) {
      console.log("Get approved");
      await (await srcToken.approve(neuronswap.address, amount)).wait();
    } else {
      console.log("No approve needed");
    }
    const newAllowance = await srcToken.allowance(signer.address, neuronswap.address);
    console.log(`Allowance ${signer.address}, ${neuronswap.address}: ${newAllowance}`);
    const simResult = await neuronswap.callStatic.swapExactKct(amount, 10, path);
    console.log(`swapExactKct: ${simResult}`);
  });
