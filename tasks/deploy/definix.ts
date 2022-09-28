import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { Definix } from "../../src/types/contracts/Uni2/Definix.sol/Definix";
import { IERC20__factory } from "../../src/types/factories/@openzeppelin/contracts/token/ERC20/IERC20__factory";
import { Definix__factory } from "../../src/types/factories/contracts/Uni2/Definix.sol/Definix__factory";

task("deploy:Definix")
  .addFlag("deploy", "Whether deploy")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const [signer]: Array<SignerWithAddress> = await ethers.getSigners();

    let definix: Definix | undefined = undefined;
    if (taskArguments.deploy) {
      const definixFactory = new Definix__factory(signer);
      definix = await definixFactory.connect(signer).deploy();
      await definix.deployed();
    } else {
      definix = Definix__factory.connect("0x646AC9D6f4bDfBC9Cd0bc0FC932f273c864136B9", signer);
    }
    console.log("Contract address: ", definix.address);
    const klay = "0x0000000000000000000000000000000000000000";
    const ousdt = "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167";
    const amount = 10000;
    const value = BigNumber.from("1000000000000000000");

    const simRes = await definix.callStatic.swapExactKlay(10, [klay, ousdt], {
      value,
    });
    console.log(`Simulation result: ${simRes}`);

    const path = [ousdt, klay];
    const amounts = await definix.getAmountsOut(amount, path);
    console.log(`getAmountsOut: ${amounts}`);

    const srcToken = IERC20__factory.connect(path[0], signer);
    const allowance = await srcToken.allowance(signer.address, definix.address);
    if (allowance.lt(amount)) {
      console.log("Get approved");
      await (await srcToken.approve(definix.address, amount)).wait();
    } else {
      console.log("No approve needed");
    }
    const newAllowance = await srcToken.allowance(signer.address, definix.address);
    console.log(`Allowance ${signer.address}, ${definix.address}: ${newAllowance}`);
    const simResult = await definix.callStatic.swapExactKct(amount, 10, path);
    console.log(`swapExactKct: ${simResult}`);
  });
