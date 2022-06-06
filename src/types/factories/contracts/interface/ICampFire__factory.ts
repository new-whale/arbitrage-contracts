/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ICampFire,
  ICampFireInterface,
} from "../../../contracts/interface/ICampFire";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "isBlock",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isProfitFee",
        type: "bool",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "logicData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "compareData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "feeData",
            type: "bytes",
          },
        ],
        internalType: "struct IAggregationRouterV1.SwapBytes",
        name: "swapBytes",
        type: "tuple",
      },
    ],
    name: "burnWoods",
    outputs: [
      {
        internalType: "uint256",
        name: "totalIZN",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "claimIZN",
    outputs: [
      {
        internalType: "uint256",
        name: "iznAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "countWoods",
    outputs: [
      {
        internalType: "uint256",
        name: "totalWoods",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "pendingIZN",
    outputs: [
      {
        internalType: "uint32",
        name: "campFireIdx",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "pending",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "supplyAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "userWoodsAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "supplyWoods",
    outputs: [
      {
        internalType: "uint256",
        name: "iznAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class ICampFire__factory {
  static readonly abi = _abi;
  static createInterface(): ICampFireInterface {
    return new utils.Interface(_abi) as ICampFireInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ICampFire {
    return new Contract(address, _abi, signerOrProvider) as ICampFire;
  }
}
