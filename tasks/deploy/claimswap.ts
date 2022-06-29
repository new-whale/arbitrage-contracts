import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { Claimswap } from "../../src/types/contracts/Uni2/Claimswap.sol/Claimswap";
import { IERC20__factory } from "../../src/types/factories/@openzeppelin/contracts/token/ERC20/IERC20__factory";
import { Claimswap__factory } from "../../src/types/factories/contracts/Uni2/Claimswap.sol/Claimswap__factory";

task("deploy:Claimswap")
  .addFlag("deploy", "Whether deploy")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const [_a, _b, signer]: SignerWithAddress[] = await ethers.getSigners();

    let claimswap: Claimswap | undefined = undefined;
    if (taskArguments.deploy) {
      const claimswapFactory = new Claimswap__factory(signer);
      claimswap = await claimswapFactory.connect(signer).deploy();
      await claimswap.deployed();
    } else {
      claimswap = Claimswap__factory.connect("0x92Ac54216A7Ff37B5BE1b6A9240cf81646923920", signer);
    }
    console.log("Contract address: ", claimswap.address);
    // const tokenInfos = await claimswap.tokenInfos();
    // console.log("TokenInfos: ", tokenInfos.slice(0, 10));
    // const wklay = await claimswap.WKLAY();
    const klay = "0x0000000000000000000000000000000000000000";
    const ousdt = "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167";
    const krno = "0xd676e57ca65b827feb112ad81ff738e7b6c1048d";
    // const amountss = await claimswap.getAmountsOut(BigNumber.from("1000000"), [ousdt, klay]);
    // console.log(`Amounts: ${amountss}`)
    // const amounts = await claimswap.getAmountsOut(value, [klay, ousdt]);
    // console.log(`Amounts: ${amounts}`)
    // const r = await (await claimswap.swapExactKlay(10, [klay, ousdt],{value: value})).wait();
    // console.log(`Swap tx ${r.transactionHash}`);

    // const simRes = await claimswap.callStatic.swapExactKlay(10, [klay, ousdt],{value: value});
    // console.log(`Simulation result: ${simRes}`)

    const path = [ousdt, klay];
    const amount = 10000;

    const amounts = await claimswap.getAmountsOut(amount, path);
    console.log(`getAmountsOut: ${amounts}`);

    const srcToken = IERC20__factory.connect(path[0], signer);
    const allowance = await srcToken.allowance(signer.address, claimswap.address);
    if (allowance.lt(amount)) {
      console.log(`Get approved`);
      await (await srcToken.approve(claimswap.address, amount)).wait();
    } else {
      console.log(`No approve needed`);
    }
    const newAllowance = await srcToken.allowance(signer.address, claimswap.address);
    console.log(`Allowance ${signer.address}, ${claimswap.address}: ${newAllowance}`);
    const simResult = await claimswap.callStatic.swapExactKct(amount, 10, path);
    console.log(`swapExactKct: ${simResult}`);
  });
