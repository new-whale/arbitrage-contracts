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
} from "../../common";

export declare namespace IViewer {
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

export interface IViewerInterface extends utils.Interface {
  functions: {
    "tokenInfo(address)": FunctionFragment;
    "tokenInfos()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "tokenInfo" | "tokenInfos"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "tokenInfo", values: [string]): string;
  encodeFunctionData(
    functionFragment: "tokenInfos",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "tokenInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenInfos", data: BytesLike): Result;

  events: {};
}

export interface IViewer extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IViewerInterface;

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
    tokenInfo(
      token: string,
      overrides?: CallOverrides
    ): Promise<[IViewer.ITokenViewerStructOutput]>;

    tokenInfos(
      overrides?: CallOverrides
    ): Promise<[IViewer.ITokenViewerStructOutput[]]>;
  };

  tokenInfo(
    token: string,
    overrides?: CallOverrides
  ): Promise<IViewer.ITokenViewerStructOutput>;

  tokenInfos(
    overrides?: CallOverrides
  ): Promise<IViewer.ITokenViewerStructOutput[]>;

  callStatic: {
    tokenInfo(
      token: string,
      overrides?: CallOverrides
    ): Promise<IViewer.ITokenViewerStructOutput>;

    tokenInfos(
      overrides?: CallOverrides
    ): Promise<IViewer.ITokenViewerStructOutput[]>;
  };

  filters: {};

  estimateGas: {
    tokenInfo(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    tokenInfos(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    tokenInfo(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenInfos(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
