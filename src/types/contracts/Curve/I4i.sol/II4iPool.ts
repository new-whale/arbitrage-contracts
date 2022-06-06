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
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../../common";

export interface II4iPoolInterface extends utils.Interface {
  functions: {
    "A()": FunctionFragment;
    "APrecise()": FunctionFragment;
    "N_COINS()": FunctionFragment;
    "addLiquidity(uint256[],uint256)": FunctionFragment;
    "adminFee()": FunctionFragment;
    "balanceList()": FunctionFragment;
    "balances(uint256)": FunctionFragment;
    "calcTokenAmount(uint256[],bool)": FunctionFragment;
    "calcWithdraw(uint256)": FunctionFragment;
    "calcWithdrawOneToken(uint256,uint256)": FunctionFragment;
    "calcWithdrawOneTokenWithoutFee(uint256,uint256)": FunctionFragment;
    "coinIndex(address)": FunctionFragment;
    "coinList()": FunctionFragment;
    "coins(uint256)": FunctionFragment;
    "exchange(uint256,uint256,uint256,uint256)": FunctionFragment;
    "fee()": FunctionFragment;
    "getDy(uint256,uint256,uint256)": FunctionFragment;
    "getDyUnderlying(uint256,uint256,uint256)": FunctionFragment;
    "getDyUnderlyingWithoutFee(uint256,uint256,uint256)": FunctionFragment;
    "getDyWithoutFee(uint256,uint256,uint256)": FunctionFragment;
    "getVirtualPrice()": FunctionFragment;
    "removeLiquidity(uint256,uint256[])": FunctionFragment;
    "removeLiquidityImbalance(uint256[],uint256)": FunctionFragment;
    "removeLiquidityOneToken(uint256,uint256,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "A"
      | "APrecise"
      | "N_COINS"
      | "addLiquidity"
      | "adminFee"
      | "balanceList"
      | "balances"
      | "calcTokenAmount"
      | "calcWithdraw"
      | "calcWithdrawOneToken"
      | "calcWithdrawOneTokenWithoutFee"
      | "coinIndex"
      | "coinList"
      | "coins"
      | "exchange"
      | "fee"
      | "getDy"
      | "getDyUnderlying"
      | "getDyUnderlyingWithoutFee"
      | "getDyWithoutFee"
      | "getVirtualPrice"
      | "removeLiquidity"
      | "removeLiquidityImbalance"
      | "removeLiquidityOneToken"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "A", values?: undefined): string;
  encodeFunctionData(functionFragment: "APrecise", values?: undefined): string;
  encodeFunctionData(functionFragment: "N_COINS", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "addLiquidity",
    values: [BigNumberish[], BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "adminFee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "balanceList",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "balances",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "calcTokenAmount",
    values: [BigNumberish[], boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "calcWithdraw",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "calcWithdrawOneToken",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "calcWithdrawOneTokenWithoutFee",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "coinIndex", values: [string]): string;
  encodeFunctionData(functionFragment: "coinList", values?: undefined): string;
  encodeFunctionData(functionFragment: "coins", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "exchange",
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "fee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getDy",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getDyUnderlying",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getDyUnderlyingWithoutFee",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getDyWithoutFee",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getVirtualPrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "removeLiquidity",
    values: [BigNumberish, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "removeLiquidityImbalance",
    values: [BigNumberish[], BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "removeLiquidityOneToken",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "A", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "APrecise", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "N_COINS", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "adminFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "balanceList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balances", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "calcTokenAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calcWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calcWithdrawOneToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calcWithdrawOneTokenWithoutFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "coinIndex", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "coinList", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "coins", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "exchange", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "fee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getDy", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getDyUnderlying",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDyUnderlyingWithoutFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDyWithoutFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVirtualPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeLiquidityImbalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeLiquidityOneToken",
    data: BytesLike
  ): Result;

  events: {};
}

export interface II4iPool extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: II4iPoolInterface;

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
    A(overrides?: CallOverrides): Promise<[BigNumber]>;

    APrecise(overrides?: CallOverrides): Promise<[BigNumber]>;

    N_COINS(overrides?: CallOverrides): Promise<[BigNumber]>;

    addLiquidity(
      amounts: BigNumberish[],
      minMintAmounts: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    adminFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    balanceList(
      overrides?: CallOverrides
    ): Promise<[BigNumber[]] & { balances_: BigNumber[] }>;

    balances(i: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    calcTokenAmount(
      amounts: BigNumberish[],
      deposit: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    calcWithdraw(
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    calcWithdrawOneToken(
      _tokenAmount: BigNumberish,
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    calcWithdrawOneTokenWithoutFee(
      _tokenAmount: BigNumberish,
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    coinIndex(coin: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    coinList(
      overrides?: CallOverrides
    ): Promise<[string[]] & { coins_: string[] }>;

    coins(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    exchange(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      minDy: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    fee(overrides?: CallOverrides): Promise<[BigNumber]>;

    getDy(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getDyUnderlying(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getDyUnderlyingWithoutFee(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getDyWithoutFee(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getVirtualPrice(overrides?: CallOverrides): Promise<[BigNumber]>;

    removeLiquidity(
      _amount: BigNumberish,
      minAmounts: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeLiquidityImbalance(
      amounts: BigNumberish[],
      maxBurnAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    removeLiquidityOneToken(
      _tokenAmount: BigNumberish,
      i: BigNumberish,
      minAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  A(overrides?: CallOverrides): Promise<BigNumber>;

  APrecise(overrides?: CallOverrides): Promise<BigNumber>;

  N_COINS(overrides?: CallOverrides): Promise<BigNumber>;

  addLiquidity(
    amounts: BigNumberish[],
    minMintAmounts: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  adminFee(overrides?: CallOverrides): Promise<BigNumber>;

  balanceList(overrides?: CallOverrides): Promise<BigNumber[]>;

  balances(i: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  calcTokenAmount(
    amounts: BigNumberish[],
    deposit: boolean,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  calcWithdraw(
    _amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  calcWithdrawOneToken(
    _tokenAmount: BigNumberish,
    i: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  calcWithdrawOneTokenWithoutFee(
    _tokenAmount: BigNumberish,
    i: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  coinIndex(coin: string, overrides?: CallOverrides): Promise<BigNumber>;

  coinList(overrides?: CallOverrides): Promise<string[]>;

  coins(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  exchange(
    i: BigNumberish,
    j: BigNumberish,
    dx: BigNumberish,
    minDy: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  fee(overrides?: CallOverrides): Promise<BigNumber>;

  getDy(
    i: BigNumberish,
    j: BigNumberish,
    dx: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getDyUnderlying(
    i: BigNumberish,
    j: BigNumberish,
    dx: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getDyUnderlyingWithoutFee(
    i: BigNumberish,
    j: BigNumberish,
    dx: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getDyWithoutFee(
    i: BigNumberish,
    j: BigNumberish,
    dx: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getVirtualPrice(overrides?: CallOverrides): Promise<BigNumber>;

  removeLiquidity(
    _amount: BigNumberish,
    minAmounts: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeLiquidityImbalance(
    amounts: BigNumberish[],
    maxBurnAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  removeLiquidityOneToken(
    _tokenAmount: BigNumberish,
    i: BigNumberish,
    minAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    A(overrides?: CallOverrides): Promise<BigNumber>;

    APrecise(overrides?: CallOverrides): Promise<BigNumber>;

    N_COINS(overrides?: CallOverrides): Promise<BigNumber>;

    addLiquidity(
      amounts: BigNumberish[],
      minMintAmounts: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    adminFee(overrides?: CallOverrides): Promise<BigNumber>;

    balanceList(overrides?: CallOverrides): Promise<BigNumber[]>;

    balances(i: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    calcTokenAmount(
      amounts: BigNumberish[],
      deposit: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calcWithdraw(
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    calcWithdrawOneToken(
      _tokenAmount: BigNumberish,
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calcWithdrawOneTokenWithoutFee(
      _tokenAmount: BigNumberish,
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    coinIndex(coin: string, overrides?: CallOverrides): Promise<BigNumber>;

    coinList(overrides?: CallOverrides): Promise<string[]>;

    coins(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    exchange(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      minDy: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    fee(overrides?: CallOverrides): Promise<BigNumber>;

    getDy(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDyUnderlying(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDyUnderlyingWithoutFee(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDyWithoutFee(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVirtualPrice(overrides?: CallOverrides): Promise<BigNumber>;

    removeLiquidity(
      _amount: BigNumberish,
      minAmounts: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    removeLiquidityImbalance(
      amounts: BigNumberish[],
      maxBurnAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    removeLiquidityOneToken(
      _tokenAmount: BigNumberish,
      i: BigNumberish,
      minAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    A(overrides?: CallOverrides): Promise<BigNumber>;

    APrecise(overrides?: CallOverrides): Promise<BigNumber>;

    N_COINS(overrides?: CallOverrides): Promise<BigNumber>;

    addLiquidity(
      amounts: BigNumberish[],
      minMintAmounts: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    adminFee(overrides?: CallOverrides): Promise<BigNumber>;

    balanceList(overrides?: CallOverrides): Promise<BigNumber>;

    balances(i: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    calcTokenAmount(
      amounts: BigNumberish[],
      deposit: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calcWithdraw(
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calcWithdrawOneToken(
      _tokenAmount: BigNumberish,
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calcWithdrawOneTokenWithoutFee(
      _tokenAmount: BigNumberish,
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    coinIndex(coin: string, overrides?: CallOverrides): Promise<BigNumber>;

    coinList(overrides?: CallOverrides): Promise<BigNumber>;

    coins(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    exchange(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      minDy: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    fee(overrides?: CallOverrides): Promise<BigNumber>;

    getDy(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDyUnderlying(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDyUnderlyingWithoutFee(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDyWithoutFee(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVirtualPrice(overrides?: CallOverrides): Promise<BigNumber>;

    removeLiquidity(
      _amount: BigNumberish,
      minAmounts: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeLiquidityImbalance(
      amounts: BigNumberish[],
      maxBurnAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    removeLiquidityOneToken(
      _tokenAmount: BigNumberish,
      i: BigNumberish,
      minAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    A(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    APrecise(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    N_COINS(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addLiquidity(
      amounts: BigNumberish[],
      minMintAmounts: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    adminFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceList(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balances(
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calcTokenAmount(
      amounts: BigNumberish[],
      deposit: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calcWithdraw(
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calcWithdrawOneToken(
      _tokenAmount: BigNumberish,
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calcWithdrawOneTokenWithoutFee(
      _tokenAmount: BigNumberish,
      i: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    coinIndex(
      coin: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    coinList(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    coins(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    exchange(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      minDy: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    fee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getDy(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getDyUnderlying(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getDyUnderlyingWithoutFee(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getDyWithoutFee(
      i: BigNumberish,
      j: BigNumberish,
      dx: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVirtualPrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removeLiquidity(
      _amount: BigNumberish,
      minAmounts: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeLiquidityImbalance(
      amounts: BigNumberish[],
      maxBurnAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    removeLiquidityOneToken(
      _tokenAmount: BigNumberish,
      i: BigNumberish,
      minAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
