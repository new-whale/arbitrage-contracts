// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;
import { ReentrancyGuard } from "../../lib/ReentrancyGuard.sol";
import { Ownable } from "../../lib/Ownable.sol";
import { IERC20 } from "../../intf/IERC20.sol";

interface Routing {
    function getAmountOut(
        address fromToken,
        uint256 amountIn,
        address toToken,
        bytes calldata moreInfo
    ) external returns (uint256 _output);

    function swapExactIn(
        address fromToken,
        uint256 amountIn,
        address toToken,
        bytes calldata moreInfo,
        address to
    ) external returns (uint256 _output);
}

abstract contract IRouterAdapter is ReentrancyGuard, Routing, Ownable {
    receive() external payable {}

    fallback() external payable {}

    function withdraw(address[] tokens) onlyOwner external {
        for (uint i = 0; i < tokens.length; i++) {
            if (tokens[i] == address(0)) {
                msg.sender.transfer(address(this).balance);
            } else {
                IERC20(tokens[i]).transfer(msg.sender, IERC20(tokens[i]).balanceOf(address(this)));
            }
        }
    }
}
