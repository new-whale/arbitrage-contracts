// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

interface IDexRouter {
    function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts);

    function swap(
        uint256 amountIn,
        address[] calldata path,
        address from,
        address to
    ) external payable returns (uint256 amount);
}
