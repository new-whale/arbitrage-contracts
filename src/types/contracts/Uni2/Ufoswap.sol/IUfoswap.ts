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

export interface IUfoswapInterface extends utils.Interface {
  functions: {
    "getAmountsIn(uint256,address[])": FunctionFragment;
    "getAmountsOut(uint256,address[])": FunctionFragment;
    "swapExactKLAYForTokens(uint256,address[],address,uint256)": FunctionFragment;
    "swapExactTokensForKLAY(uint256,uint256,address[],address,uint256)": FunctionFragment;
    "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)": FunctionFragment;
    "swapKLAYForExactTokens(uint256,address[],address,uint256)": FunctionFragment;
    "swapTokensForExactKLAY(uint256,uint256,address[],address,uint256)": FunctionFragment;
    "swapTokensForExactTokens(uint256,uint256,address[],address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getAmountsIn"
      | "getAmountsOut"
      | "swapExactKLAYForTokens"
      | "swapExactTokensForKLAY"
      | "swapExactTokensForTokens"
      | "swapKLAYForExactTokens"
      | "swapTokensForExactKLAY"
      | "swapTokensForExactTokens"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getAmountsIn",
    values: [BigNumberish, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getAmountsOut",
    values: [BigNumberish, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "swapExactKLAYForTokens",
    values: [BigNumberish, string[], string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "swapExactTokensForKLAY",
    values: [BigNumberish, BigNumberish, string[], string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "swapExactTokensForTokens",
    values: [BigNumberish, BigNumberish, string[], string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "swapKLAYForExactTokens",
    values: [BigNumberish, string[], string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "swapTokensForExactKLAY",
    values: [BigNumberish, BigNumberish, string[], string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "swapTokensForExactTokens",
    values: [BigNumberish, BigNumberish, string[], string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "getAmountsIn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAmountsOut",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapExactKLAYForTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapExactTokensForKLAY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapExactTokensForTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapKLAYForExactTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapTokensForExactKLAY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapTokensForExactTokens",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IUfoswap extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IUfoswapInterface;

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
    getAmountsIn(
      amountOut: BigNumberish,
      path: string[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]] & { amounts: BigNumber[] }>;

    getAmountsOut(
      amountIn: BigNumberish,
      path: string[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]] & { amounts: BigNumber[] }>;

    swapExactKLAYForTokens(
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    swapExactTokensForKLAY(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    swapExactTokensForTokens(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    swapKLAYForExactTokens(
      amountOut: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    swapTokensForExactKLAY(
      amountOut: BigNumberish,
      amountInMax: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    swapTokensForExactTokens(
      amountOut: BigNumberish,
      amountInMax: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  getAmountsIn(
    amountOut: BigNumberish,
    path: string[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  getAmountsOut(
    amountIn: BigNumberish,
    path: string[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  swapExactKLAYForTokens(
    amountOutMin: BigNumberish,
    path: string[],
    to: string,
    deadline: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  swapExactTokensForKLAY(
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: string[],
    to: string,
    deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  swapExactTokensForTokens(
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: string[],
    to: string,
    deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  swapKLAYForExactTokens(
    amountOut: BigNumberish,
    path: string[],
    to: string,
    deadline: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  swapTokensForExactKLAY(
    amountOut: BigNumberish,
    amountInMax: BigNumberish,
    path: string[],
    to: string,
    deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  swapTokensForExactTokens(
    amountOut: BigNumberish,
    amountInMax: BigNumberish,
    path: string[],
    to: string,
    deadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getAmountsIn(
      amountOut: BigNumberish,
      path: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    getAmountsOut(
      amountIn: BigNumberish,
      path: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    swapExactKLAYForTokens(
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    swapExactTokensForKLAY(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    swapExactTokensForTokens(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    swapKLAYForExactTokens(
      amountOut: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    swapTokensForExactKLAY(
      amountOut: BigNumberish,
      amountInMax: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    swapTokensForExactTokens(
      amountOut: BigNumberish,
      amountInMax: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;
  };

  filters: {};

  estimateGas: {
    getAmountsIn(
      amountOut: BigNumberish,
      path: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAmountsOut(
      amountIn: BigNumberish,
      path: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    swapExactKLAYForTokens(
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    swapExactTokensForKLAY(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    swapExactTokensForTokens(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    swapKLAYForExactTokens(
      amountOut: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    swapTokensForExactKLAY(
      amountOut: BigNumberish,
      amountInMax: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    swapTokensForExactTokens(
      amountOut: BigNumberish,
      amountInMax: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getAmountsIn(
      amountOut: BigNumberish,
      path: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAmountsOut(
      amountIn: BigNumberish,
      path: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    swapExactKLAYForTokens(
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    swapExactTokensForKLAY(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    swapExactTokensForTokens(
      amountIn: BigNumberish,
      amountOutMin: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    swapKLAYForExactTokens(
      amountOut: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    swapTokensForExactKLAY(
      amountOut: BigNumberish,
      amountInMax: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    swapTokensForExactTokens(
      amountOut: BigNumberish,
      amountInMax: BigNumberish,
      path: string[],
      to: string,
      deadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
