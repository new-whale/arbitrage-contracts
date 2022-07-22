// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

interface IUniswapV2Router {
    function getAmountsIn(uint256 amountOut, address[] calldata path) external view returns (uint256[] memory amounts);

    function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts);
}
