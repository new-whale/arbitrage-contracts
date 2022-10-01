// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.15;
import { ReentrancyGuard } from "../../lib/ReentrancyGuard.sol";
import { IRouterAdapter } from "../intf/IRouterAdapter.sol";
import { IKlayswapExchange, IKlayswap } from "../intf/IUniV2.sol";

import { UniERC20 } from "../../lib/UniERC20.sol";
import { IERC20 } from "../../intf/IERC20.sol";
import { SafeMath } from "../../lib/SafeMath.sol";
import "hardhat/console.sol";

contract KlayswapAdapter is IRouterAdapter {
    using SafeMath for uint256;
    using UniERC20 for IERC20;
    address public immutable ksp;

    constructor(address _ksp) {
        ksp = _ksp;
    }

    function getAmountOut(
        address fromToken,
        uint256 amountIn,
        address toToken,
        bytes calldata moreInfo
    ) public view override returns (uint256 _output) {
        address[] memory path = abi.decode(moreInfo, (address[]));

        _output = amountIn;

        for (uint i = 0; i < path.length + 1; i++) {
          address tokenA = (i == 0) ? fromToken : path[i - 1];
          address tokenB = (i == path.length) ? toToken : path[i];
          address pool = IKlayswap(ksp).tokenToPool(tokenA, tokenB);
          _output = IKlayswapExchange(pool).estimatePos(tokenA, _output);
        }
    }

    function swapExactIn(
        address fromToken,
        uint256 amountIn,
        address toToken,
        bytes calldata moreInfo,
        address to
    ) external payable override returns (uint256 _output) {
        address[] memory path = abi.decode(moreInfo, (address[]));

        if (fromToken == address(0)) {
          IKlayswap(ksp).exchangeKlayPos{ value: amountIn }(toToken, 1, path);
          _output = IERC20(toToken).uniBalanceOf(address(this));
          IERC20(toToken).uniTransfer(to, _output);
        } else {
          IKlayswap(ksp).exchangeKctPos(fromToken, amountIn, toToken, 1, path);
          _output = IERC20(toToken).uniBalanceOf(address(this));
          IERC20(toToken).uniTransfer(to, _output);
        }
    }
}
