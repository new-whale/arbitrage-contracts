import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { Roundrobin } from "../../src/types/contracts/Uni2/Roundrobin.sol/Roundrobin";
import { IERC20__factory } from "../../src/types/factories/@openzeppelin/contracts/token/ERC20/IERC20__factory";
import { Roundrobin__factory } from "../../src/types/factories/contracts/Uni2/Roundrobin.sol/Roundrobin__factory";

task("deploy:Roundrobin")
  .addFlag("deploy", "Whether deploy")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const [signer]: Array<SignerWithAddress> = await ethers.getSigners();

    let roundrobin: Roundrobin | undefined = undefined;
    if (taskArguments.deploy) {
      const roundrobinFactory = new Roundrobin__factory(signer);
      roundrobin = await roundrobinFactory.connect(signer).deploy();
      await roundrobin.deployed();
    } else {
      roundrobin = Roundrobin__factory.connect("0x49827F9910797ba0Db9eC7306D7fb8C447bf13eC", signer);
    }
    console.log("Contract address: ", roundrobin.address);
    const klay = "0x0000000000000000000000000000000000000000";
    const ousdt = "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167";
    const amount = 10000;
    const value = BigNumber.from("1000000000000000000");

    const simRes = await roundrobin.callStatic.swapExactKlay(10, [klay, ousdt], {
      value,
    });
    console.log(`Simulation result: ${simRes}`);

    const path = [ousdt, klay];
    const amounts = await roundrobin.getAmountsOut(amount, path);
    console.log(`getAmountsOut: ${amounts}`);

    const srcToken = IERC20__factory.connect(path[0], signer);
    const allowance = await srcToken.allowance(signer.address, roundrobin.address);
    if (allowance.lt(amount)) {
      console.log("Get approved");
      await (await srcToken.approve(roundrobin.address, amount)).wait();
    } else {
      console.log("No approve needed");
    }
    const newAllowance = await srcToken.allowance(signer.address, roundrobin.address);
    console.log(`Allowance ${signer.address}, ${roundrobin.address}: ${newAllowance}`);
    const simResult = await roundrobin.callStatic.swapExactKct(amount, 10, path);
    console.log(`swapExactKct: ${simResult}`);
  });
