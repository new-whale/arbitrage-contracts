// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IKlayswapFactory {
    function tokenToPool(address tokenA, address tokenB) external view returns (address);

    function createKctPool(
        address tokenA,
        uint256 amountA,
        address tokenB,
        uint256 amountB,
        uint256 fee
    ) external;

    function createKlayPool(
        address token,
        uint256 amount,
        uint256 fee
    ) external payable;
}
