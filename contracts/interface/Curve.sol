//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;
import "./IViewer.sol";
import "../libraries/UniERC20.sol";
import "../libraries/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";

interface ICurvePool {
    function A() external view returns (uint256);

    function APrecise() external view returns (uint256);

    function N_COINS() external view returns (uint256);

    function fee() external view returns (uint256);

    function adminFee() external view returns (uint256);

    function getVirtualPrice() external view returns (uint256);

    function addLiquidity(
        uint256[] calldata amounts,
        uint256 minMintAmount,
        uint256 deadline
    ) external returns (uint256);

    function getLpToken() external view returns (address);

    function tokenList() external view returns (address[] memory);

    function getTokenBalances() external view returns (uint256[] memory);

    function getTokenBalance(uint256 i) external view returns (uint256);

    function getDy(
        uint256 i,
        uint256 j,
        uint256 dx
    ) external view returns (uint256);

    function getDyWithoutFee(
        uint256 i,
        uint256 j,
        uint256 dx
    ) external view returns (uint256);

    function getDyUnderlying(
        uint256 i,
        uint256 j,
        uint256 dx
    ) external view returns (uint256);

    function getDyUnderlyingWithoutFee(
        uint256 i,
        uint256 j,
        uint256 dx
    ) external view returns (uint256);

    function calcTokenAmount(uint256[] calldata amounts, bool deposit) external view returns (uint256);

    function calcWithdraw(uint256 _amount) external view returns (uint256[] memory);

    function calcWithdrawOneToken(uint256 _tokenAmount, uint256 i) external view returns (uint256);

    function calcWithdrawOneTokenWithoutFee(uint256 _tokenAmount, uint256 i) external view returns (uint256);

    function tokenIndex(address token) external view returns (uint256);

    function getToken(uint256 i) external view returns (address);

    function exchange(
        uint256 i,
        uint256 j,
        uint256 dx,
        uint256 minDy
    ) external payable returns (uint256);

    function removeLiquidity(uint256 _amount, uint256[] calldata minAmounts) external returns (uint256[] memory);

    function removeLiquidityImbalance(uint256[] calldata amounts, uint256 maxBurnAmount) external returns (uint256);

    function removeLiquidityOneToken(
        uint256 _tokenAmount,
        uint256 i,
        uint256 minAmount
    ) external returns (uint256);
}

interface ICurve {
    function addPool(address _pool, address token) external;

    function addPools(address[] calldata _pools_, address[] calldata tokens) external;

    function removePool(uint256 idx) external;

    function removePools(uint256[] calldata idxes) external;

    function AOfPool(address pool) external view returns (uint256 A);

    function AOfPools() external view returns (uint256[] memory A);

    function WKLAY() external view returns (address);

    function pools() external view returns (address[] memory poolAddrs, address[] memory tokenAddrs);

    function pool(uint256 i) external view returns (address poolAddr, address tokenAddr);

    function poolNum() external view returns (uint256);

    function getDy(address[] calldata _path, uint256 _amount) external view returns (uint256[] memory);

    function getDyWithoutFee(address[] calldata _path, uint256 _amount) external view returns (uint256[] memory);

    function swapWithPath(
        address[] calldata _path,
        uint256 _amount,
        uint256 _minAmount
    ) external payable returns (uint256 output);

    function addLiquidityKLAY(
        address lpContract,
        address[] calldata coins,
        uint256[] calldata amounts,
        uint256 minAmount
    ) external payable returns (uint256);

    function addLiquidity(
        address lpContract,
        address[] calldata coins,
        uint256[] calldata amounts,
        uint256 minAmount
    ) external returns (uint256);

    function removeLiquidity(
        address lpContract,
        uint256 _amount,
        address[] calldata coins,
        uint256[] calldata minAmounts
    ) external returns (uint256[] memory);

    function removeLiquidityOneToken(
        address lpContract,
        uint256 _amount,
        address coin,
        uint256 minAmount
    ) external returns (uint256);
}

abstract contract Curve is ICurve, IViewer, Ownable, Pausable {
    using SafeERC20 for IERC20;
    using UniERC20 for IERC20;
    using SafeCast for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;
    struct poolAndToken {
        EnumerableSet.AddressSet pools;
        EnumerableSet.AddressSet tokens;
    }
    mapping(address => uint64) poolTypes;

    poolAndToken internal _pools;

    fallback() external payable {}

    receive() external payable {}

    function router() external view virtual returns (address);

    function poolInfo(address pool) external view virtual returns (ICurveViewer memory);

    function poolInfos() external view virtual returns (ICurveViewer[] memory, uint256);

    function pools() external view virtual override returns (address[] memory poolAddrs, address[] memory tokenAddrs) {
        poolAddrs = new address[](_pools.pools.length());
        tokenAddrs = new address[](_pools.tokens.length());

        for (uint256 i; i < _pools.pools.length(); i++) {
            poolAddrs[i] = _pools.pools.at(i);
            tokenAddrs[i] = _pools.tokens.at(i);
        }
    }

    function pool(uint256 i) external view virtual override returns (address poolAddr, address tokenAddr) {
        poolAddr = _pools.pools.at(i);
        tokenAddr = _pools.tokens.at(i);
    }

    function poolNum() external view virtual override returns (uint256) {
        return _pools.pools.length();
    }

    function tokenInfo(address token) external view virtual override returns (ITokenViewer memory) {
        ITokenViewer memory Token = ITokenViewer(
            token,
            IERC20Metadata(token).decimals(),
            IERC20Metadata(token).name(),
            IERC20Metadata(token).symbol()
        );
        return Token;
    }

    function setPoolTypes(address[] calldata poolAddrs, uint64[] calldata types) external onlyOwner {
        for (uint256 i; i < poolAddrs.length; i++) {
            _setPoolType(poolAddrs[i], types[i]);
        }
    }

    function _setPoolType(address _pool, uint64 i) internal {
        poolTypes[_pool] = i;
    }

    function _addPool(address _pool, address token) internal {
        _pools.pools.add(_pool);
        _pools.tokens.add(token);
    }

    function addPool(address _pool, address token) external override onlyOwner {
        _addPool(_pool, token);
    }

    function addPools(address[] calldata _pools_, address[] calldata tokens) external override onlyOwner {
        require(_pools_.length == tokens.length, "POOL_TOKEN_NUM_DIFF");
        for (uint8 i; i < _pools_.length; i++) {
            _addPool(_pools_[i], tokens[i]);
        }
    }

    function removePool(uint256 idx) external override onlyOwner {
        _pools.pools.remove(_pools.pools.at(idx));
        _pools.tokens.remove(_pools.tokens.at(idx));
    }

    function removePools(uint256[] calldata idxes) external override onlyOwner {
        for (uint256 i; i < idxes.length; i++) {
            this.removePool(idxes[i]);
        }
    }

    function approveIfNeeded(
        address token,
        address pair,
        uint256 amount
    ) internal {
        if (!(token == address(0))) {
            uint256 allowance = IERC20(token).allowance(address(this), pair);
            if (allowance < amount) {
                IERC20(token).safeApprove(pair, type(uint256).max);
            }
        }
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
