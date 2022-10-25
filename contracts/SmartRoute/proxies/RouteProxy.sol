// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

import { IERC20 } from "../../intf/IERC20.sol";
import { IWETH } from "../../intf/IWETH.sol";
import { SafeMath } from "../../lib/SafeMath.sol";
import { ReentrancyGuard } from "../../lib/ReentrancyGuard.sol";
import { Withdrawable } from "../../lib/Withdrawable.sol";
import { UniERC20 } from "../../lib/UniERC20.sol";
import { SafeERC20 } from "../../lib/SafeERC20.sol";
import { MultiAMMLib } from "../../lib/MultiAMMLib.sol";
import { IRouterAdapter } from "../intf/IRouterAdapter.sol";

import "hardhat/console.sol";

contract RouteProxy is Withdrawable, ReentrancyGuard {
    using SafeMath for uint256;
    using UniERC20 for IERC20;
    using SafeERC20 for IERC20;

    receive() external payable {}

    fallback() external payable {}

    // ============ Storage ============

    address constant _ETH_ADDRESS_ = 0x0000000000000000000000000000000000000000;

    // ============ Events ============

    event OrderHistory(
        address fromToken,
        address toToken,
        address sender,
        uint256 fromAmount,
        uint256 returnAmount,
        uint256 deductedFee
    );

    // ============ Modifiers ============

    modifier checkDeadline(uint256 deadLine) {
        require(deadLine >= block.timestamp, "RouteProxy: EXPIRED");
        _;
    }

    function splitSwap(
        address fromToken,
        uint256 amountIn,
        address toToken,
        address to,
        uint256[] calldata weights,
        MultiAMMLib.Swap[][] calldata swaps,
        uint256 minReturnAmount,
        uint256 deadLine
    ) public payable checkDeadline(deadLine) nonReentrant returns (uint256 output) {
        require(weights.length == swaps.length, "WS LEN NOT MATCH");

        uint256 totalWeight = 0;
        for (uint i; i < weights.length; i++) {
            totalWeight += weights[i];
        }

        uint256 restAmountIn = amountIn;
        for (uint i; i < weights.length; i++) {
            uint256 currentAmountIn = i == weights.length - 1 ?
                restAmountIn :
                amountIn.mul(weights[i]).div(totalWeight);
            restAmountIn = restAmountIn.sub(currentAmountIn);

            if (swaps[i][0].fromToken == _ETH_ADDRESS_) {
                payable(swaps[i][0].recipient).transfer(currentAmountIn);
            } else {
                IERC20(swaps[i][0].fromToken).transferFrom(msg.sender, swaps[i][0].recipient, currentAmountIn);
            }

            for (uint j; j < swaps[i].length; j++) {
                address swapTo = (j < swaps[i].length - 1) ?
                    swaps[i][j+1].recipient :
                    to;

                currentAmountIn = IRouterAdapter(payable(swaps[i][j].adapter)).swapExactIn(
                    swaps[i][j].fromToken,
                    currentAmountIn,
                    swaps[i][j].toToken,
                    swaps[i][j].moreInfo,
                    swapTo
                );
            }
            output += currentAmountIn;
        }

        require(output >= minReturnAmount, "Slippage");
    }

    function arbSwap(
        address fromToken,
        uint256 amountIn,
        address to,
        MultiAMMLib.Swap[] calldata swaps
    ) public payable nonReentrant returns (uint256 output) {
        uint256 estimated = getLinearSwapOut(fromToken, amountIn, fromToken, swaps);
        require(estimated >= amountIn, "SLIP1");

        if (swaps[0].fromToken == _ETH_ADDRESS_) {
            payable(swaps[0].recipient).transfer(amountIn);
        } else {
            IERC20(swaps[0].fromToken).transferFrom(msg.sender, swaps[0].recipient, amountIn);
        }

        output = amountIn;
        for (uint i; i < swaps.length; i++) {
            address swapTo = (i < swaps.length - 1) ?
                swaps[i+1].recipient :
                to;

            output = IRouterAdapter(payable(swaps[i].adapter)).swapExactIn(
                swaps[i].fromToken,
                output,
                swaps[i].toToken,
                swaps[i].moreInfo,
                swapTo
            );
        }

        require(output >= amountIn, "SLIP2");
    }

    function getLinearSwapOut(
        address fromToken,
        uint256 amountIn,
        address toToken,
        MultiAMMLib.Swap[] calldata swaps
    ) public returns (uint256 output) {
        output = amountIn;

        for (uint i; i < swaps.length; i++) {
            output = IRouterAdapter(payable(swaps[i].adapter)).getAmountOut(
                swaps[i].fromToken,
                output,
                swaps[i].toToken,
                swaps[i].moreInfo
            );
        }
    }
}
