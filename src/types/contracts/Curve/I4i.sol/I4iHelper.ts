/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
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

export interface I4iHelperInterface extends utils.Interface {
  functions: {
    "CurveRouter()": FunctionFragment;
    "WKLAY()": FunctionFragment;
    "poolRegistry()": FunctionFragment;
    "router()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "CurveRouter" | "WKLAY" | "poolRegistry" | "router"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "CurveRouter",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "WKLAY", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "poolRegistry",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "router", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "CurveRouter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "WKLAY", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "poolRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "router", data: BytesLike): Result;

  events: {};
}

export interface I4iHelper extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: I4iHelperInterface;

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
    CurveRouter(overrides?: CallOverrides): Promise<[string]>;

    WKLAY(overrides?: CallOverrides): Promise<[string]>;

    poolRegistry(overrides?: CallOverrides): Promise<[string]>;

    router(overrides?: CallOverrides): Promise<[string]>;
  };

  CurveRouter(overrides?: CallOverrides): Promise<string>;

  WKLAY(overrides?: CallOverrides): Promise<string>;

  poolRegistry(overrides?: CallOverrides): Promise<string>;

  router(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    CurveRouter(overrides?: CallOverrides): Promise<string>;

    WKLAY(overrides?: CallOverrides): Promise<string>;

    poolRegistry(overrides?: CallOverrides): Promise<string>;

    router(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    CurveRouter(overrides?: CallOverrides): Promise<BigNumber>;

    WKLAY(overrides?: CallOverrides): Promise<BigNumber>;

    poolRegistry(overrides?: CallOverrides): Promise<BigNumber>;

    router(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    CurveRouter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    WKLAY(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolRegistry(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    router(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
