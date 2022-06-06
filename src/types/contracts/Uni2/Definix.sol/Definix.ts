/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../../common";

export declare namespace IViewer {
  export type IUni2ViewerStruct = {
    totalSupply: BigNumberish;
    tokenBalances: BigNumberish[];
    pool: string;
    tokenList: string[];
    fees: BigNumberish[];
    decimals: BigNumberish;
    name: string;
    symbol: string;
  };

  export type IUni2ViewerStructOutput = [
    BigNumber,
    BigNumber[],
    string,
    string[],
    BigNumber[],
    number,
    string,
    string
  ] & {
    totalSupply: BigNumber;
    tokenBalances: BigNumber[];
    pool: string;
    tokenList: string[];
    fees: BigNumber[];
    decimals: number;
    name: string;
    symbol: string;
  };

  export type ITokenViewerStruct = {
    token: string;
    decimals: BigNumberish;
    name: string;
    symbol: string;
  };

  export type ITokenViewerStructOutput = [string, number, string, string] & {
    token: string;
    decimals: number;
    name: string;
    symbol: string;
  };
}

export interface DefinixInterface extends utils.Interface {
  functions: {
    "WKLAY()": FunctionFragment;
    "addLiquidity(address,address,uint256,uint256,address)": FunctionFragment;
    "addLiquidityKLAY(address,uint256,address)": FunctionFragment;
    "factory()": FunctionFragment;
    "getAmountsOut(uint256,address[])": FunctionFragment;
    "owner()": FunctionFragment;
    "pause()": FunctionFragment;
    "paused()": FunctionFragment;
    "pendingOwner()": FunctionFragment;
    "poolInfo(address)": FunctionFragment;
    "poolInfos()": FunctionFragment;
    "pools()": FunctionFragment;
    "pullOwnership()": FunctionFragment;
    "pushOwnership(address)": FunctionFragment;
    "removeLiquidity(address,address,uint256,uint256,uint256,address)": FunctionFragment;
    "removeLiquidityKLAY(address,uint256,uint256,uint256,address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "router()": FunctionFragment;
    "swapExactKct(uint256,uint256,address[])": FunctionFragment;
    "swapExactKlay(uint256,address[])": FunctionFragment;
    "tokenInfo(address)": FunctionFragment;
    "tokenInfos()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "unpause()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "WKLAY"
      | "addLiquidity"
      | "addLiquidityKLAY"
      | "factory"
      | "getAmountsOut"
      | "owner"
      | "pause"
      | "paused"
      | "pendingOwner"
      | "poolInfo"
      | "poolInfos"
      | "pools"
      | "pullOwnership"
      | "pushOwnership"
      | "removeLiquidity"
      | "removeLiquidityKLAY"
      | "renounceOwnership"
      | "router"
      | "swapExactKct"
      | "swapExactKlay"
      | "tokenInfo"
      | "tokenInfos"
      | "transferOwnership"
      | "unpause"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "WKLAY", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "addLiquidity",
    values: [string, string, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "addLiquidityKLAY",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getAmountsOut",
    values: [BigNumberish, string[]]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pendingOwner",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "poolInfo", values: [string]): string;
  encodeFunctionData(functionFragment: "poolInfos", values?: undefined): string;
  encodeFunctionData(functionFragment: "pools", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pullOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "pushOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "removeLiquidity",
    values: [string, string, BigNumberish, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "removeLiquidityKLAY",
    values: [string, BigNumberish, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "router", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "swapExactKct",
    values: [BigNumberish, BigNumberish, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "swapExactKlay",
    values: [BigNumberish, string[]]
  ): string;
  encodeFunctionData(functionFragment: "tokenInfo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "tokenInfos",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;

  decodeFunctionResult(functionFragment: "WKLAY", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addLiquidityKLAY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAmountsOut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pendingOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "poolInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "poolInfos", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pools", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pullOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "pushOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeLiquidityKLAY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "router", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "swapExactKct",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapExactKlay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenInfos", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "Paused(address)": EventFragment;
    "PushedOwnership(address)": EventFragment;
    "Unpaused(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PushedOwnership"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface PausedEventObject {
  account: string;
}
export type PausedEvent = TypedEvent<[string], PausedEventObject>;

export type PausedEventFilter = TypedEventFilter<PausedEvent>;

export interface PushedOwnershipEventObject {
  candidateOwner: string;
}
export type PushedOwnershipEvent = TypedEvent<
  [string],
  PushedOwnershipEventObject
>;

export type PushedOwnershipEventFilter = TypedEventFilter<PushedOwnershipEvent>;

export interface UnpausedEventObject {
  account: string;
}
export type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export interface Definix extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DefinixInterface;

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
    WKLAY(overrides?: CallOverrides): Promise<[string]>;

    addLiquidity(
      tokenA: string,
      tokenB: string,
      amountADesired: BigNumberish,
      amountBDesired: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addLiquidityKLAY(
      token: string,
      amountTokenDesired: BigNumberish,
      to: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    factory(overrides?: CallOverrides): Promise<[string]>;

    getAmountsOut(
      amountIn: BigNumberish,
      path: string[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]] & { amounts: BigNumber[] }>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    pendingOwner(overrides?: CallOverrides): Promise<[string]>;

    poolInfo(
      pool: string,
      overrides?: CallOverrides
    ): Promise<[IViewer.IUni2ViewerStructOutput]>;

    poolInfos(
      overrides?: CallOverrides
    ): Promise<[IViewer.IUni2ViewerStructOutput[], BigNumber]>;

    pools(
      overrides?: CallOverrides
    ): Promise<[string[]] & { poolAddrs: string[] }>;

    pullOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    pushOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeLiquidity(
      tokenA: string,
      tokenB: string,
      liquidity: BigNumberish,
      amountAMin: BigNumberish,
      amountBMin: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeLiquidityKLAY(
      token: string,
      liquidity: BigNumberish,
      amountTokenMin: BigNumberish,
      amountKLAYMin: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    router(overrides?: CallOverrides): Promise<[string]>;

    swapExactKct(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    swapExactKlay(
      amountOutMin: BigNumberish,
      path: string[],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    tokenInfo(
      token: string,
      overrides?: CallOverrides
    ): Promise<[IViewer.ITokenViewerStructOutput]>;

    tokenInfos(
      overrides?: CallOverrides
    ): Promise<[IViewer.ITokenViewerStructOutput[]]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  WKLAY(overrides?: CallOverrides): Promise<string>;

  addLiquidity(
    tokenA: string,
    tokenB: string,
    amountADesired: BigNumberish,
    amountBDesired: BigNumberish,
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addLiquidityKLAY(
    token: string,
    amountTokenDesired: BigNumberish,
    to: string,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  factory(overrides?: CallOverrides): Promise<string>;

  getAmountsOut(
    amountIn: BigNumberish,
    path: string[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  owner(overrides?: CallOverrides): Promise<string>;

  pause(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  pendingOwner(overrides?: CallOverrides): Promise<string>;

  poolInfo(
    pool: string,
    overrides?: CallOverrides
  ): Promise<IViewer.IUni2ViewerStructOutput>;

  poolInfos(
    overrides?: CallOverrides
  ): Promise<[IViewer.IUni2ViewerStructOutput[], BigNumber]>;

  pools(overrides?: CallOverrides): Promise<string[]>;

  pullOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  pushOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeLiquidity(
    tokenA: string,
    tokenB: string,
    liquidity: BigNumberish,
    amountAMin: BigNumberish,
    amountBMin: BigNumberish,
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeLiquidityKLAY(
    token: string,
    liquidity: BigNumberish,
    amountTokenMin: BigNumberish,
    amountKLAYMin: BigNumberish,
    to: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  router(overrides?: CallOverrides): Promise<string>;

  swapExactKct(
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  swapExactKlay(
    amountOutMin: BigNumberish,
    path: string[],
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  tokenInfo(
    token: string,
    overrides?: CallOverrides
  ): Promise<IViewer.ITokenViewerStructOutput>;

  tokenInfos(
    overrides?: CallOverrides
  ): Promise<IViewer.ITokenViewerStructOutput[]>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unpause(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    WKLAY(overrides?: CallOverrides): Promise<string>;

    addLiquidity(
      tokenA: string,
      tokenB: string,
      amountADesired: BigNumberish,
      amountBDesired: BigNumberish,
      to: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        amountA: BigNumber;
        amountB: BigNumber;
        liquidity: BigNumber;
      }
    >;

    addLiquidityKLAY(
      token: string,
      amountTokenDesired: BigNumberish,
      to: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber] & {
        amountToken: BigNumber;
        amountKLAY: BigNumber;
        liquidity: BigNumber;
      }
    >;

    factory(overrides?: CallOverrides): Promise<string>;

    getAmountsOut(
      amountIn: BigNumberish,
      path: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    owner(overrides?: CallOverrides): Promise<string>;

    pause(overrides?: CallOverrides): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    pendingOwner(overrides?: CallOverrides): Promise<string>;

    poolInfo(
      pool: string,
      overrides?: CallOverrides
    ): Promise<IViewer.IUni2ViewerStructOutput>;

    poolInfos(
      overrides?: CallOverrides
    ): Promise<[IViewer.IUni2ViewerStructOutput[], BigNumber]>;

    pools(overrides?: CallOverrides): Promise<string[]>;

    pullOwnership(overrides?: CallOverrides): Promise<void>;

    pushOwnership(newOwner: string, overrides?: CallOverrides): Promise<void>;

    removeLiquidity(
      tokenA: string,
      tokenB: string,
      liquidity: BigNumberish,
      amountAMin: BigNumberish,
      amountBMin: BigNumberish,
      to: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amountA: BigNumber; amountB: BigNumber }
    >;

    removeLiquidityKLAY(
      token: string,
      liquidity: BigNumberish,
      amountTokenMin: BigNumberish,
      amountKLAYMin: BigNumberish,
      to: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { amountToken: BigNumber; amountKLAY: BigNumber }
    >;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    router(overrides?: CallOverrides): Promise<string>;

    swapExactKct(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    swapExactKlay(
      amountOutMin: BigNumberish,
      path: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenInfo(
      token: string,
      overrides?: CallOverrides
    ): Promise<IViewer.ITokenViewerStructOutput>;

    tokenInfos(
      overrides?: CallOverrides
    ): Promise<IViewer.ITokenViewerStructOutput[]>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    unpause(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "Paused(address)"(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    "PushedOwnership(address)"(
      candidateOwner?: string | null
    ): PushedOwnershipEventFilter;
    PushedOwnership(candidateOwner?: string | null): PushedOwnershipEventFilter;

    "Unpaused(address)"(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;
  };

  estimateGas: {
    WKLAY(overrides?: CallOverrides): Promise<BigNumber>;

    addLiquidity(
      tokenA: string,
      tokenB: string,
      amountADesired: BigNumberish,
      amountBDesired: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addLiquidityKLAY(
      token: string,
      amountTokenDesired: BigNumberish,
      to: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    factory(overrides?: CallOverrides): Promise<BigNumber>;

    getAmountsOut(
      amountIn: BigNumberish,
      path: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    pendingOwner(overrides?: CallOverrides): Promise<BigNumber>;

    poolInfo(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

    poolInfos(overrides?: CallOverrides): Promise<BigNumber>;

    pools(overrides?: CallOverrides): Promise<BigNumber>;

    pullOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    pushOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeLiquidity(
      tokenA: string,
      tokenB: string,
      liquidity: BigNumberish,
      amountAMin: BigNumberish,
      amountBMin: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeLiquidityKLAY(
      token: string,
      liquidity: BigNumberish,
      amountTokenMin: BigNumberish,
      amountKLAYMin: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    router(overrides?: CallOverrides): Promise<BigNumber>;

    swapExactKct(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    swapExactKlay(
      amountOutMin: BigNumberish,
      path: string[],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    tokenInfo(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    tokenInfos(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    WKLAY(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addLiquidity(
      tokenA: string,
      tokenB: string,
      amountADesired: BigNumberish,
      amountBDesired: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addLiquidityKLAY(
      token: string,
      amountTokenDesired: BigNumberish,
      to: string,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    factory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getAmountsOut(
      amountIn: BigNumberish,
      path: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pendingOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolInfo(
      pool: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    poolInfos(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pools(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pullOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    pushOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeLiquidity(
      tokenA: string,
      tokenB: string,
      liquidity: BigNumberish,
      amountAMin: BigNumberish,
      amountBMin: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeLiquidityKLAY(
      token: string,
      liquidity: BigNumberish,
      amountTokenMin: BigNumberish,
      amountKLAYMin: BigNumberish,
      to: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    router(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    swapExactKct(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    swapExactKlay(
      amountOutMin: BigNumberish,
      path: string[],
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    tokenInfo(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenInfos(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
