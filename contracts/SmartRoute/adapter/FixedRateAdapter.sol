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

contract FixedRateAdapter is IRouterAdapter {
    using SafeMath for uint256;
    using UniERC20 for IERC20;

    mapping (address => mapping (address => uint256)) prices;

    address constant _ETH_ADDRESS_ = 0x0000000000000000000000000000000000000000;

    function getAmountOut(
        address fromToken,
        uint256 amountIn,
        address toToken,
        bytes calldata
    ) public view override returns (uint256 _output) {
        uint256 price = prices[fromToken][toToken];
        _output = amountIn * price / 1e18;
    }

    function swapExactIn(
        address fromToken,
        uint256 amountIn,
        address toToken,
        bytes calldata,
        address to
    ) external override returns (uint256 _output) {
        uint256 price = prices[fromToken][toToken];
        _output = amountIn * price / 1e18;

        IERC20(toToken).uniTransfer(to, _output);
    }

    function setPrice(address fromToken, address toToken, uint256 price) onlyOwner external {
        prices[fromToken][toToken] = price;
    }
}
