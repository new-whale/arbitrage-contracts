import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { task } from 'hardhat/config';
import type { TaskArguments } from 'hardhat/types';

import { INewWhaleRouter, NewWhaleRouter } from '../../src/types/contracts/NewWhaleRouter';
import { NewWhaleRouter__factory } from '../../src/types/factories/contracts/NewWhaleRouter__factory';

// from constants/router.go
const allRouters = [
  {
    Address: '0x646AC9D6f4bDfBC9Cd0bc0FC932f273c864136B9',
    Name: 'Definix',
    Type: 0,
  },
  {
    Address: '0xB88acA327c018Beb86B7bcDe08D3abBdA3C2B1fB',
    Name: 'Klayswap',
    Type: 0,
  },
  {
    Address: '0x6B128C502D30D9D4C43a1002071d5151CE4BBd81',
    Name: 'Ufoswap',
    Type: 0,
  },
  {
    Address: '0xd1286716B4A91b5dA85759260be1FB24724E50D4',
    Name: 'Paladex',
    Type: 0,
  },
  {
    Address: '0x49827F9910797ba0Db9eC7306D7fb8C447bf13eC',
    Name: 'Roundrobin',
    Type: 0,
  },
  {
    Address: '0x92Ac54216A7Ff37B5BE1b6A9240cf81646923920',
    Name: 'Claimswap',
    Type: 0,
  },
  {
    Address: '0x880E6f7E82584200daba1269f9F1EB82d05f6479',
    Name: 'Neuronswap',
    Type: 0,
  },
  {
    Address: '0x03de7AF29dFD6ac5Bf57A4ad3F985E455f3115aC',
    Name: 'I4i',
    Type: 1,
  },
  {
    Address: '0x5764789cc20E5f05953b8E59055a7714a7d540D4',
    Name: 'Eklipse',
    Type: 1,
  },
];

task('deploy:NewWhaleRouter')
  .addFlag('deploy', 'Whether deploy')
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const [signer]: Array<SignerWithAddress> = await ethers.getSigners();

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
    }
    else {
      newWhaleRouter = NewWhaleRouter__factory.connect('0xA534A17c1ABCE1119aA772451DcA249352aCB9a0', signer);
    }
    console.log(`Contract address: ${newWhaleRouter.address}`);

    const klayToUsdt: INewWhaleRouter.SwapRouteStruct = {
      routes: [
        {
          amountInNumerator: 1,
          amountInDenominator: 2,
          routes: [
            {
              dexId: 0,
              path: ['0x0000000000000000000000000000000000000000', '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167'],
            },
          ],
        },
        {
          amountInNumerator: 1,
          amountInDenominator: 1,
          routes: [
            {
              dexId: 1,
              path: ['0x0000000000000000000000000000000000000000', '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167'],
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
              path: ['0x5c74070fdea071359b86082bd9f9b3deaafbe32b', '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167'],
            },
          ],
        },
        {
          amountInNumerator: 1,
          amountInDenominator: 1,
          routes: [
            {
              dexId: 7,
              path: ['0x5c74070fdea071359b86082bd9f9b3deaafbe32b', '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167'],
            },
          ],
        },
      ],
    };

    const one = BigNumber.from('10000000000000000');
    await newWhaleRouter.swapToken(one, 0, klayToUsdt, signer.address, signer.address, 1658993149000, {
      value: one,
      gasLimit: 1000000,
    });
    // await newWhaleRouter.callStatic.swapToken(one, 0, daiToUsdt, signer.address, signer.address, 1658993149000, {
    //   value: one,
    //   gasLimit: 1000000,
    // });
    // const tx = await newWhaleRouter.swapToken(one, 0, x, signer.address, signer.address, 1658993149000, { value: one, gasLimit: 1000000 });
    // const r = await tx.wait();
    // console.log(r.transactionHash);
  });
