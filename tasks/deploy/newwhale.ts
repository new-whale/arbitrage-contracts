import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import { INewWhaleRouter, NewWhaleRouter } from "../../src/types/contracts/NewWhaleRouter";
import { NewWhaleRouter__factory } from "../../src/types/factories/contracts/NewWhaleRouter__factory";

// from constants/router.go
const allRouters = [
  {
    Address: "0xC5d8642EDaEBA754775B5562cf8Aef8d507dE1cF",
    Name: "Definix",
    Type: 0,
  },
  {
    Address: "0xB88acA327c018Beb86B7bcDe08D3abBdA3C2B1fB",
    Name: "Klayswap",
    Type: 0,
  },
  {
    Address: "0x75E1Dc08BbA20aBf73f4Dabd9c3621969F1432c2",
    Name: "Ufoswap",
    Type: 0,
  },
  {
    Address: "0xDa3Aa1eD4B0C792a0022378779972cc5D4792cf8",
    Name: "Paladex",
    Type: 0,
  },
  {
    Address: "0x44c580eB1031EeAcb5b62352D6D7287674fe6E63",
    Name: "Roundrobin",
    Type: 0,
  },
  {
    Address: "0x0147F7A4dD37Aa8C184b769564700D7aeB6eB280",
    Name: "Claimswap",
    Type: 0,
  },
  {
    Address: "0x4e13fD35F4Decb24150dfA1Cf392E56E406a5bA4",
    Name: "Neuronswap",
    Type: 0,
  },
  {
    Address: "0xeEEfe4E24f67FBe8483cF5615DFEeda77a1f5D01",
    Name: "I4i",
    Type: 1,
  },
  {
    Address: "0x822172425ADb4900591fB90eC4Fb347b3084Fd39",
    Name: "Eklipse",
    Type: 1,
  },
];

task("deploy:NewWhaleRouter")
  .addFlag("deploy", "Whether deploy")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const [_a, _b, signer]: SignerWithAddress[] = await ethers.getSigners();

    console.log(`Signer ${signer.address}`);
    let newWhaleRouter: NewWhaleRouter | undefined = undefined;
    if (taskArguments.deploy) {
      const newWhaleRouterFactory = new NewWhaleRouter__factory(signer);
      newWhaleRouter = await newWhaleRouterFactory.connect(signer).deploy(
        allRouters.map(r => r.Address),
        allRouters.map(r => r.Type),
        [signer.address],
      );
      await newWhaleRouter.deployed();
    } else {
      newWhaleRouter = NewWhaleRouter__factory.connect("0xacd83e9c49f9e2818feb40bb988b3184ded402e8", signer);
    }

    const klayToUsdt: INewWhaleRouter.SwapRouteStruct = {
      routes: [
        {
          amountInNumerator: 1,
          amountInDenominator: 2,
          routes: [
            {
              dexId: 0,
              path: ["0x0000000000000000000000000000000000000000", "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167"],
            },
          ],
        },
        {
          amountInNumerator: 1,
          amountInDenominator: 1,
          routes: [
            {
              dexId: 1,
              path: ["0x0000000000000000000000000000000000000000", "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167"],
            },
          ],
        },
      ],
    };

    const daiToUsdt: INewWhaleRouter.SwapRouteStruct = {
      routes: [
        {
          amountInNumerator: 1,
          amountInDenominator: 2,
          routes: [
            {
              dexId: 7,
              path: ["0x5c74070fdea071359b86082bd9f9b3deaafbe32b", "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167"],
            },
          ],
        },
        {
          amountInNumerator: 1,
          amountInDenominator: 1,
          routes: [
            {
              dexId: 7,
              path: ["0x5c74070fdea071359b86082bd9f9b3deaafbe32b", "0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167"],
            },
          ],
        },
      ],
    };

    console.log(`Contract address: ${newWhaleRouter.address}`);

    const one = BigNumber.from("1000000000000000000");
    await newWhaleRouter.callStatic.swapToken(one, 0, klayToUsdt, signer.address, signer.address, 1658993149000, {
      value: one,
      gasLimit: 1000000,
    });
    await newWhaleRouter.callStatic.swapToken(one, 0, daiToUsdt, signer.address, signer.address, 1658993149000, {
      value: one,
      gasLimit: 1000000,
    });
    // const tx = await newWhaleRouter.swapToken(one, 0, x, signer.address, signer.address, 1658993149000, { value: one, gasLimit: 1000000 });
    // const r = await tx.wait();
    // console.log(r.transactionHash);
  });
