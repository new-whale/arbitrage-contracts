import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { I4i } from "../../src/types/contracts/Curve/I4i.sol/I4i";
import { I4i__factory } from "../../src/types/factories/contracts/Curve/I4i.sol/I4i__factory";

task("deploy:I4i")
  .addFlag("deploy", "Whether deploy")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const [signer]: SignerWithAddress[] = await ethers.getSigners();

    let i4i: I4i | undefined = undefined;
    if (taskArguments.deploy) {
      const i4iFactory = new I4i__factory(signer);
      i4i = await i4iFactory.connect(signer).deploy();
      await i4i.deployed();
    } else {
      i4i = I4i__factory.connect("0xB9146A0B053B1C69815f21D580867F175a62F8c1", signer);
    }
    console.log("Contract address: ", i4i.address);
    const [poolInfos, n] = await i4i.poolInfos();
    console.log("TokenInfos: ", poolInfos.slice(0, 10));
  });
