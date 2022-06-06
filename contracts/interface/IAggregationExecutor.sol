// SPDX-License-Identifier: UNLICENSED
import "./IMultiAMM.sol";
pragma solidity 0.8.7;

/// @title Interface for making arbitrary calls during swap
interface IAggregationExecutor is IMultiAMM {
    /// @notice Make calls on `srcSpender` with specified data
    function callBytes(
        uint256 mode,
        address srcSpender,
        bytes calldata data
    ) external payable; // 0x2636f7f8

    function batchSwapExactInBlock(
        address srcSpender,
        address to,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        Swap[][][] memory swapSequences
    ) external payable returns (uint256 totalAmountOut);

    function batchSwapExactIn(
        address srcSpender,
        address to,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        Swap[][] memory swapSequences
    ) external payable returns (uint256 totalAmountOut);

    function getDexTypeAddrs(uint8 dexType) external view returns (address[] memory dexes);

    function getAllDexTypeAddrs() external view returns (address[][] memory dexes);
}
