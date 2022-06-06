// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.7;
import "./IMultiAMM.sol";

/// @title Interface for making MultihopRouter
interface IEisenMultihopRouter is IMultiAMM {
    event LogFee(uint256 fee, address output);
    event Profit(uint256 profit);
    event Exchange(address pair, uint256 amountOut, address output);

    struct InNOut {
        address tokenIn;
        address tokenOut;
    }
    struct BlockDescription {
        address tokenIn;
        address tokenOut;
        uint8 partAcc;
        uint8 parts;
    }

    struct SwapExecutorDescriptionBlock {
        address to;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        Swap[][][] swapSequences;
    }

    struct SwapExecutorDescription {
        address to;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        Swap[][] swapSequences;
    }

    struct DexTypes {
        address[] dexes;
        uint8 dexType;
    }

    function executeSingleSwapExactIn(
        Swap[] memory swapSequences,
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external payable returns (uint256 amountOut);

    function calAndExecuteSingleSwapExactIn(
        Swap[] memory swapSequences,
        address tokenIn,
        uint256 amountIn
    ) external payable returns (uint256 amountOut);

    function calSingleSwapExactIn(Swap[] memory swapSequences) external view returns (uint256 amountOut);

    function calMultihopBatchSwapExactIn(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        Swap[][] memory swapSequences
    ) external view returns (uint256 totalAmountOut);

    function calbatchSwapExactInBlock(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        Swap[][][] memory swapSequences
    ) external view returns (uint256 totalAmountOut);

    // i is type of dex
    function getDexes(uint8 i) external view returns (address[] memory dexes);

    function getDexesAll() external view returns (DexTypes[] memory dexes);

    function addDex(address dex, uint8 dexType) external;

    function addDexes(address[] calldata dexes, uint8[] calldata dexTypes) external;

    function removeDex(address dex) external;

    function removeDexes(address[] calldata dexes) external;
}
