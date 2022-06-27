import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { NewWhaleRouter } from "../../src/types/contracts/NewWhaleRouter";
import { NewWhaleRouter__factory } from "../../src/types/factories/contracts/NewWhaleRouter__factory";

task("deploy:NewWhaleRouter")
  .addFlag("deploy", "Whether deploy")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const [_a, _b, signer]: SignerWithAddress[] = await ethers.getSigners();

    console.log(`Signer ${signer.address}`);
    let newWhaleRouter: NewWhaleRouter | undefined = undefined;
    if (taskArguments.deploy) {
      const newWhaleRouterFactory = new NewWhaleRouter__factory(signer);
      newWhaleRouter = await newWhaleRouterFactory.connect(signer).deploy(
        ["0xC5d8642EDaEBA754775B5562cf8Aef8d507dE1cF"],
        ["0"],
        [signer.address],
        // {
        //   gasLimit: 3000000
        // }
      );
      await newWhaleRouter.deployed();
    } else {
      newWhaleRouter = NewWhaleRouter__factory.connect("0x0147F7A4dD37Aa8C184b769564700D7aeB6eB280", signer);
    }
    console.log("Contract address: ", newWhaleRouter.address);
    // const tokenInfos = await newWhaleRouter.();
    // console.log("TokenInfos: ", tokenInfos.slice(0, 10));
  });
