import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { Eklipse } from "../../src/types/contracts/Curve/Eklipse.sol/Eklipse";
import { Eklipse__factory } from "../../src/types/factories/contracts/Curve/Eklipse.sol/Eklipse__factory";

task("deploy:Eklipse")
  .addFlag("deploy", "Whether deploy")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const [signer]: SignerWithAddress[] = await ethers.getSigners();

    let eklipse: Eklipse | undefined = undefined;
    if (taskArguments.deploy) {
      const eklipseFactory = new Eklipse__factory(signer);
      eklipse = await eklipseFactory.connect(signer).deploy();
      await eklipse.deployed();
    } else {
      eklipse = Eklipse__factory.connect("0x78d77d2397E6420304B347B5288558eD45EF67D8", signer);
    }
    console.log("Contract address: ", eklipse.address);
    const [poolInfos, n] = await eklipse.poolInfos();
    console.log("TokenInfos: ", poolInfos.slice(0, 10));
  });
