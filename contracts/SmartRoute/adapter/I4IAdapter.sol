// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.15;
import "hardhat/console.sol";
import { IRouterAdapter } from "../intf/IRouterAdapter.sol";
import {
    II4ISwapPool
} from "../intf/II4I.sol";
import { IERC20 } from "../../intf/IERC20.sol";
import { SafeMath } from "../../lib/SafeMath.sol";
import { UniERC20 } from "../../lib/UniERC20.sol";
import { SafeERC20 } from "../../lib/SafeERC20.sol";
import "hardhat/console.sol";

// In curve factory = registry
contract I4IAdapter is IRouterAdapter {
    using SafeMath for uint256;
    using UniERC20 for IERC20;

    function getAmountOut(
        address fromToken,
        uint256 amountIn,
        address toToken,
        bytes calldata moreInfo
    ) external view override returns (uint256 _output) {
        (address pool, uint256 tp, uint256 ncoin) = abi.decode(moreInfo, (address, uint256, uint256));

        if (tp == 0) { // swap
            uint256 i = II4ISwapPool(pool).coinIndex(fromToken);
            uint256 j = II4ISwapPool(pool).coinIndex(toToken);
            _output = II4ISwapPool(pool).getDy(i, j, amountIn);
        } else if (tp == 1) { // token -> lp
            uint256 i = II4ISwapPool(pool).coinIndex(fromToken);
            uint256[] memory amounts = new uint256[](ncoin);
            amounts[i] = amountIn;
            // practical 
            _output = II4ISwapPool(pool).calcTokenAmount(amounts, true).mul(9996465).div(10000000);
        } else if (tp == 2) { // lp -> token
            uint256 j = II4ISwapPool(pool).coinIndex(toToken);
            _output = II4ISwapPool(pool).calcWithdrawOneCoin(amountIn, j);
        } else {
            revert("INVALID TYPE");
        }
    }

    function swapExactIn(
        address fromToken,
        uint256 amountIn,
        address toToken,
        bytes calldata moreInfo,
        address to
    ) external override returns (uint256 _output) {
        (address pool, uint256 tp, uint256 ncoin) = abi.decode(moreInfo, (address, uint256, uint256));
        uint256 value;
        if (fromToken == address(0)) {
            value = amountIn;
        }

        IERC20(fromToken).universalApproveMax(pool, amountIn);
        if (tp == 0) { // swap
            uint256 i = II4ISwapPool(pool).coinIndex(fromToken);
            uint256 j = II4ISwapPool(pool).coinIndex(toToken);
            _output = II4ISwapPool(pool).exchange{ value: value }(i, j, amountIn, 1);
        } else if (tp == 1) { // token -> lp
            uint256 i = II4ISwapPool(pool).coinIndex(fromToken);
            uint256[] memory amounts = new uint256[](ncoin);
            amounts[i] = amountIn;
            _output = II4ISwapPool(pool).addLiquidity{ value: value }(amounts, 1);
        } else if (tp == 2) { // lp -> token
            uint256 j = II4ISwapPool(pool).coinIndex(toToken);
            _output = II4ISwapPool(pool).removeLiquidityOneCoin(amountIn, j, 1);
        } else {
            revert("INVALID TYPE");
        }
        IERC20(toToken).uniTransfer(to, _output);
    }
}