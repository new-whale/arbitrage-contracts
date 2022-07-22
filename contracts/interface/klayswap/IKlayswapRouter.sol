// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IKlayswapRouter {
    function exchangeKctPos(
        address tokenA,
        uint256 amountA,
        address tokenB,
        uint256 amountB,
        address[] calldata path
    ) external;

    function exchangeKlayPos(
        address token,
        uint256 amount,
        address[] calldata path
    ) external payable;
}
