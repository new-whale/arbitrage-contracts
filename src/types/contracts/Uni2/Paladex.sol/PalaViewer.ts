/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../../common";

export declare namespace PalaViewer {
  export type PoolInfoStruct = {
    pool: string;
    token0: string;
    token1: string;
    name: string;
    symbol: string;
    decimals: BigNumberish;
    totalSupply: BigNumberish;
    token0Reserve: BigNumberish;
    token1Reserve: BigNumberish;
    token0Balance: BigNumberish;
    token1Balance: BigNumberish;
  };

  export type PoolInfoStructOutput = [
    string,
    string,
    string,
    string,
    string,
    number,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    pool: string;
    token0: string;
    token1: string;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: BigNumber;
    token0Reserve: BigNumber;
    token1Reserve: BigNumber;
    token0Balance: BigNumber;
    token1Balance: BigNumber;
  };

  export type TokenInfoStruct = {
    token: string;
    name: string;
    symbol: string;
    decimals: BigNumberish;
    totalSupply: BigNumberish;
  };

  export type TokenInfoStructOutput = [
    string,
    string,
    string,
    number,
    BigNumber
  ] & {
    token: string;
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: BigNumber;
  };
}

export interface PalaViewerInterface extends utils.Interface {
  functions: {
    "poolInfo(address)": FunctionFragment;
    "poolInfos()": FunctionFragment;
    "tokenInfo(address)": FunctionFragment;
    "tokenInfos()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "poolInfo"
      | "poolInfos"
      | "tokenInfo"
      | "tokenInfos"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "poolInfo", values: [string]): string;
  encodeFunctionData(functionFragment: "poolInfos", values?: undefined): string;
  encodeFunctionData(functionFragment: "tokenInfo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "tokenInfos",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "poolInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "poolInfos", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenInfos", data: BytesLike): Result;

  events: {};
}

export interface PalaViewer extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PalaViewerInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    poolInfo(
      pool: string,
      overrides?: CallOverrides
    ): Promise<[PalaViewer.PoolInfoStructOutput]>;

    poolInfos(
      overrides?: CallOverrides
    ): Promise<[PalaViewer.PoolInfoStructOutput[]]>;

    tokenInfo(
      token: string,
      overrides?: CallOverrides
    ): Promise<[PalaViewer.TokenInfoStructOutput]>;

    tokenInfos(
      overrides?: CallOverrides
    ): Promise<[PalaViewer.TokenInfoStructOutput[]]>;
  };

  poolInfo(
    pool: string,
    overrides?: CallOverrides
  ): Promise<PalaViewer.PoolInfoStructOutput>;

  poolInfos(
    overrides?: CallOverrides
  ): Promise<PalaViewer.PoolInfoStructOutput[]>;

  tokenInfo(
    token: string,
    overrides?: CallOverrides
  ): Promise<PalaViewer.TokenInfoStructOutput>;

  tokenInfos(
    overrides?: CallOverrides
  ): Promise<PalaViewer.TokenInfoStructOutput[]>;

  callStatic: {
    poolInfo(
      pool: string,
      overrides?: CallOverrides
    ): Promise<PalaViewer.PoolInfoStructOutput>;

    poolInfos(
      overrides?: CallOverrides
    ): Promise<PalaViewer.PoolInfoStructOutput[]>;

    tokenInfo(
      token: string,
      overrides?: CallOverrides
    ): Promise<PalaViewer.TokenInfoStructOutput>;

    tokenInfos(
      overrides?: CallOverrides
    ): Promise<PalaViewer.TokenInfoStructOutput[]>;
  };

  filters: {};

  estimateGas: {
    poolInfo(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

    poolInfos(overrides?: CallOverrides): Promise<BigNumber>;

    tokenInfo(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    tokenInfos(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    poolInfo(
      pool: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    poolInfos(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenInfo(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenInfos(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
