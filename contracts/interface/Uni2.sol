//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;
import "./IUniswapV2Pair.sol";
import "./IUniswapV2Factory.sol";
import "../libraries/UniswapV2Library.sol";
import "./IWKLAY.sol";
import "./IViewer.sol";
import "../libraries/UniERC20.sol";
import "../libraries/Ownable.sol";
import { Address } from "../libraries/Address.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

interface IUni2 {
    function WKLAY() external view returns (address);

    function router() external view returns (address);

    function factory() external view returns (address);

    function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts);

    function swapExactKlay(uint256 amountOutMin, address[] calldata path) external payable returns (uint256 output);

    function swapExactKct(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path
    ) external returns (uint256 output);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        address to
    )
        external
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        );

    function addLiquidityKLAY(
        address token,
        uint256 amountTokenDesired,
        address to
    )
        external
        payable
        returns (
            uint256 amountToken,
            uint256 amountKLAY,
            uint256 liquidity
        );

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to
    ) external returns (uint256 amountA, uint256 amountB);

    function removeLiquidityKLAY(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountKLAYMin,
        address to
    ) external returns (uint256 amountToken, uint256 amountKLAY);
}

abstract contract Uni2 is IUni2, IViewer, Ownable, Pausable {
    using SafeERC20 for IERC20;
    using UniERC20 for IERC20;
    using Address for address;

    fallback() external payable {}

    receive() external payable {}

    function poolInfo(address pool) external view virtual returns (IUni2Viewer memory);

    function poolInfos() external view virtual returns (IUni2Viewer[] memory, uint256);

    function pools() external view virtual returns (address[] memory poolAddrs) {
        IUniswapV2Factory WFactory = IUniswapV2Factory(this.factory());
        uint256 poolNum = WFactory.allPairsLength();
        poolAddrs = new address[](poolNum);
        for (uint256 i; i < poolNum; i++) {
            poolAddrs[i] = WFactory.allPairs(i);
        }
    }

    function tokenInfo(address token) external view virtual override returns (ITokenViewer memory) {
        if (!token.isContract()) {
            return ITokenViewer(token, 18, "Destroyed token", "Destroyed token");
        }
        ITokenViewer memory Token = ITokenViewer(
            token,
            IERC20Metadata(token).decimals(),
            IERC20Metadata(token).name(),
            IERC20Metadata(token).symbol()
        );
        return Token;
    }

    function _makeRoutePath(address[] memory _path) internal view virtual returns (address[] memory) {
        require(_path.length >= 2, "PATH_LEN_IS_SHORT");
        address[] memory route = new address[](_path.length);
        for (uint256 i; i < _path.length; i++) {
            if (_path[i] == address(0)) {
                route[i] = this.WKLAY();
            } else {
                route[i] = _path[i];
            }
        }

        return route;
    }

    function _sliceArray(
        address[] memory _path,
        uint256 start,
        uint256 end
    ) internal pure returns (address[] memory) {
        require(_path.length >= 1 && end > start, "INVALID_ARR_SLICE");
        address[] memory newPath = new address[](end - start);
        for (uint256 i; i < end - start; i++) {
            newPath[i] = _path[i + start];
        }
        return newPath;
    }

    function approveIfNeeded(address token, uint256 amount) internal {
        if (!(token == address(0))) {
            uint256 allowance = IERC20(token).allowance(address(this), this.router());
            if (allowance < amount) {
                IERC20(token).safeApprove(this.router(), type(uint256).max);
            }
        }
    }

    function approveIfNeeded(
        address token,
        address router,
        uint256 amount
    ) internal {
        if (!(token == address(0))) {
            uint256 allowance = IERC20(token).allowance(address(this), router);
            if (allowance < amount) {
                IERC20(token).safeApprove(router, type(uint256).max);
            }
        }
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function unpause() public onlyOwner {
        _unpause();
    }
}
