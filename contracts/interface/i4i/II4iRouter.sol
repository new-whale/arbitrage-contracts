// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface II4iRouter {
    event SwapWithPath(
        address user,
        address inputToken,
        uint256 inputAmount,
        address outputToken,
        uint256 outputAmount
    );

    function getDy(
        address[] calldata _path,
        uint256[3][] calldata _swapParams,
        uint256 _amount
    ) external view returns (uint256[] memory);

    function getDyWithoutFee(
        address[] calldata _path,
        uint256[3][] calldata _swapParams,
        uint256 _amount
    ) external view returns (uint256[] memory);

    /// @notice Perform up to multiple swaps in a single transaction
    /// @dev Routing and swap params must be determined off-chain. This
    ///      functionality is designed for gas efficiency over ease-of-use.
    /// @param _path Array of [initial token, pool, token, pool, token, ...]
    ///               The array is iterated until a pool address of 0x00, then the last
    ///               given token is transferred to `msg.sender`
    /// @param _swapParams Multidimensional array of [i, j, swap type] where i and j are the correct
    ///                     values for the n'th pool in `_route`. The swap type should be 1 for
    ///                     a stableswap `exchange`, 2 for stableswap `exchange_underlying` and 3
    ///                     for a cryptoswap `exchange`.
    /// @param _amount The amount of input token.
    /// @param _minAmount The minimum amount received after the final swap.
    /// @return _outputs The array of the amount of all output tokens through the _path
    function swapWithPath(
        address[] calldata _path,
        uint256[3][] calldata _swapParams,
        uint256 _amount,
        uint256 _minAmount
    ) external payable returns (uint256[] memory _outputs);
}
