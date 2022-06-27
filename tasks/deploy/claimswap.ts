import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { Claimswap } from "../../src/types/contracts/Uni2/Claimswap.sol/Claimswap";
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
      claimswap = Claimswap__factory.connect("0x0147F7A4dD37Aa8C184b769564700D7aeB6eB280", signer);
    }
    console.log("Contract address: ", claimswap.address);
    const tokenInfos = await claimswap.tokenInfos();
    console.log("TokenInfos: ", tokenInfos.slice(0, 10));
  });
