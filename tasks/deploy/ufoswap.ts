import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { Ufoswap } from "../../src/types/contracts/Uni2/Ufoswap.sol/Ufoswap";
import { IERC20__factory } from "../../src/types/factories/@openzeppelin/contracts/token/ERC20/IERC20__factory";
import { Ufoswap__factory } from "../../src/types/factories/contracts/Uni2/Ufoswap.sol/Ufoswap__factory";

task("deploy:Ufoswap")
  .addFlag("deploy", "Whether deploy")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const [signer]: Array<SignerWithAddress> = await ethers.getSigners();

    let ufoswap: Ufoswap | undefined = undefined;
    if (taskArguments.deploy) {
      const ufoswapFactory = new Ufoswap__factory(signer);
      ufoswap = await ufoswapFactory.connect(signer).deploy();
      await ufoswap.deployed();
    } else {
      ufoswap = Ufoswap__factory.connect("0x6B128C502D30D9D4C43a1002071d5151CE4BBd81", signer);
    }
    console.log("Contract address: ", ufoswap.address);
    const klay = "0x0000000000000000000000000000000000000000";
    const ousdt = "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167";
    const amount = 10000;
    const value = BigNumber.from("1000000000000000000");

    const simRes = await ufoswap.callStatic.swapExactKlay(10, [klay, ousdt], {
      value,
    });
    console.log(`Simulation result: ${simRes}`);

    const path = [ousdt, klay];
    const amounts = await ufoswap.getAmountsOut(amount, path);
    console.log(`getAmountsOut: ${amounts}`);

    const srcToken = IERC20__factory.connect(path[0], signer);
    const allowance = await srcToken.allowance(signer.address, ufoswap.address);
    if (allowance.lt(amount)) {
      console.log("Get approved");
      await (await srcToken.approve(ufoswap.address, amount)).wait();
    } else {
      console.log("No approve needed");
    }
    const newAllowance = await srcToken.allowance(signer.address, ufoswap.address);
    console.log(`Allowance ${signer.address}, ${ufoswap.address}: ${newAllowance}`);
    const simResult = await ufoswap.callStatic.swapExactKct(amount, 10, path);
    console.log(`swapExactKct: ${simResult}`);
  });
