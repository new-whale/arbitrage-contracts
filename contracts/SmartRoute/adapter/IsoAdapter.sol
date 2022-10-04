// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.15;
import { ReentrancyGuard } from "../../lib/ReentrancyGuard.sol";
import { IRouterAdapter } from "../intf/IRouterAdapter.sol";
import { IKlayswapExchange, IKlayswap } from "../intf/IUniV2.sol";

import { UniERC20 } from "../../lib/UniERC20.sol";
import { IERC20 } from "../../intf/IERC20.sol";
import { IWETH } from "../../intf/IWETH.sol";
import { SafeMath } from "../../lib/SafeMath.sol";
import "hardhat/console.sol";

contract IsoAdapter is IRouterAdapter {
    using SafeMath for uint256;
    using UniERC20 for IERC20;

    address constant _ETH_ADDRESS_ = 0x0000000000000000000000000000000000000000;

    function getAmountOut(
        address,
        uint256 amountIn,
        address,
        bytes calldata
    ) public view override returns (uint256 _output) {
        _output = amountIn;
    }

    function swapExactIn(
        address fromToken,
        uint256 amountIn,
        address toToken,
        bytes calldata,
        address to
    ) external override returns (uint256 _output) {
        _output = amountIn;

        if (fromToken == toToken) {
            IERC20(toToken).uniTransfer(to, amountIn);
        } else {
            if (fromToken == _ETH_ADDRESS_) {
                IWETH(toToken).deposit{ value: amountIn }();
                IWETH(toToken).transfer(to, amountIn);
            } else if (toToken == _ETH_ADDRESS_) {
                IWETH(fromToken).withdraw(amountIn);
                payable(to).transfer(amountIn);
            } else {
                IWETH(fromToken).withdraw(amountIn);
                IWETH(toToken).deposit{ value: amountIn }();
                IWETH(toToken).transfer(to, amountIn);
            }
        }
    }
}
