// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0;

import {IPangeaFactory} from "./IPangeaFactory.sol";
import {IPangeaRouter} from "./IPangeaRouter.sol";
import {IERC20} from "./intf/IERC20.sol";

import "hardhat/console.sol";

/// @notice pool router interface.
contract StoneHunter {
    address factory = 0x02d9bf2d4F5cEA981cB8a8B77A56B498C5da7Eb0;
    address router = 0x17Ac28a29670e637c8a6E1ec32b38fC301303E34;

    fallback() external payable {}
    receive() external payable {}

    function huntStone(address wklay, address stone, uint256 targetBalance) payable public returns (uint256 amountOut) {
        uint256 c = IPangeaFactory(factory).poolsCount(wklay, stone);
        require(c > 0, "NO POOL YET");

        address pool = IPangeaFactory(factory).getPools(wklay, stone, 0, c)[0];
        uint256 poolBalance = IERC20(stone).balanceOf(pool);
        require(poolBalance == targetBalance, "INVALID POOL");

        IPangeaRouter.ExactInputSingleParams memory params = IPangeaRouter.ExactInputSingleParams({
            tokenIn: address(0),
            amountIn: msg.value,
            amountOutMinimum: 0,
            pool: pool,
            to: address(msg.sender),
            unwrap: false
        });

        uint256 befBalance = IERC20(stone).balanceOf(msg.sender);
        amountOut = IPangeaRouter(router).exactInputSingle{ value: msg.value }(params);
        require(amountOut > 0, "ZERO OUT");
        uint256 aftBalance = IERC20(stone).balanceOf(msg.sender);
        console.log(amountOut);
        console.log(aftBalance - befBalance);
        require(amountOut == aftBalance - befBalance, "SOMETHING WRONG");
    }
}