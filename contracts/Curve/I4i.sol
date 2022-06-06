// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "../interface/Curve.sol";

// swap: exchange 함수
// deposit: addLiquidity 함수
// withdraw: removeLiquidity, removeLiquidityOneCoin, removeLiquidityImbalance

// calc x => y : getDy 함수
// calc x <= y : getDx 함수
// calc addLiquidity & removeLiquidityImbalance: calcTokenAmount함수
// calc removeLiquidityOneCoin: calcWithdrawOneCoin 함수
// calc removeLiquidity: calcWithdraw 함수
// 함수 input의 i, j 값은 토큰의 index입니다. (coinIndex 함수로 index를 조회할 수 있습니다.)

// router : 0x8F7B94b20c74B03F17C7680f54AD8eE418282CF4
// K4Pool: KSD(0), KDAI(1), KUSDC(2), KUSDT(3)
// KSDKASH: KSD(0), KASH(1)

// I4i 0.06% of output swap fee
library I4iHelper {
    address public constant router = 0x8F7B94b20c74B03F17C7680f54AD8eE418282CF4;
    address public constant WKLAY = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address public constant poolRegistry = 0xBd21dD5BCFE28475D26154935894d4F515A7b1C0;
    II4iRouter public constant CurveRouter = II4iRouter(router);
}

interface IPoolRegistry {
    struct PoolInfo {
        uint128 index;
        uint64 nCoins;
        uint64 poolType;
        uint256 decimals;
        address[] coins;
        string name;
    }

    function poolCount() external view returns (uint256);

    function poolList(uint256) external view returns (address);

    function findPoolForCoins(
        address _from,
        address _to,
        uint256 i
    ) external view returns (address);

    function getAllPoolInfos() external view returns (address[] memory, PoolInfo[] memory);

    function getPoolInfo(address _pool) external view returns (PoolInfo memory);

    function getLpToken(address) external view returns (address);

    function getCoinList() external view returns (address[] memory);
}

interface II4iRouter {
    function getDy(
        address[] calldata _path,
        uint256[3][] calldata _swapParams,
        uint256 _amount
    ) external view returns (uint256[] memory);

    function getDyWithoutFee(
        address[] calldata _path,
        uint256[3][] calldata _swapParams,
        uint256 _amount
    ) external view returns (uint256[] memory);

    function swapWithPath(
        address[] calldata _path,
        uint256[3][] calldata _swapParams,
        uint256 _amount,
        uint256 _minAmount
    ) external payable returns (uint256[] memory _outputs);
}

interface II4iPool {
    function A() external view returns (uint256);

    function adminFee() external view returns (uint256);

    function APrecise() external view returns (uint256);

    function N_COINS() external view returns (uint256);

    function fee() external view returns (uint256);

    function getVirtualPrice() external view returns (uint256);

    function addLiquidity(uint256[] calldata amounts, uint256 minMintAmounts) external payable returns (uint256);

    function coinList() external view returns (address[] memory coins_);

    function balanceList() external view returns (uint256[] memory balances_);

    function balances(uint256 i) external view returns (uint256);

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

    function coinIndex(address coin) external view returns (uint256);

    function coins(uint256) external view returns (address);

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

contract I4i is Curve {
    using SafeERC20 for IERC20;
    using UniERC20 for IERC20;
    using SafeCast for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;

    constructor() {
        for (uint256 i; i < IPoolRegistry(I4iHelper.poolRegistry).poolCount(); i++) {
            address _pool = IPoolRegistry(I4iHelper.poolRegistry).poolList(i);
            IPoolRegistry.PoolInfo memory shortPoolInfo = IPoolRegistry(I4iHelper.poolRegistry).getPoolInfo(_pool);
            poolTypes[_pool] = shortPoolInfo.poolType;
        }
    }

    function WKLAY() external pure override returns (address) {
        return I4iHelper.WKLAY;
    }

    function router() external pure override returns (address) {
        return I4iHelper.router;
    }

    function pools() external view virtual override returns (address[] memory poolAddrs, address[] memory tokenAddrs) {
        uint256 _poolNum = IPoolRegistry(I4iHelper.poolRegistry).poolCount();
        poolAddrs = new address[](_poolNum);
        tokenAddrs = new address[](_poolNum);

        for (uint256 i; i < _poolNum; i++) {
            poolAddrs[i] = IPoolRegistry(I4iHelper.poolRegistry).poolList(i);
            tokenAddrs[i] = IPoolRegistry(I4iHelper.poolRegistry).getLpToken(poolAddrs[i]);
        }
    }

    function pool(uint256 i) external view virtual override returns (address poolAddr, address tokenAddr) {
        poolAddr = IPoolRegistry(I4iHelper.poolRegistry).poolList(i);
        tokenAddr = IPoolRegistry(I4iHelper.poolRegistry).getLpToken(poolAddr);
    }

    function poolNum() external view virtual override returns (uint256) {
        return IPoolRegistry(I4iHelper.poolRegistry).poolCount();
    }

    function AOfPool(address _pool) external view override returns (uint256 A) {
        return II4iPool(_pool).A();
    }

    function AOfPools() external view override returns (uint256[] memory A) {
        uint256[] memory As = new uint256[](_pools.pools.length());
        for (uint8 i; i < _pools.pools.length(); i++) {
            As[i] = this.AOfPool(_pools.pools.at(i));
        }
        return As;
    }

    function _makeSwapParams(address[] calldata _path) internal view returns (uint256[3][] memory swapParams) {
        require(_path.length % 2 == 1, "path length is invalid");
        address[] memory coins = new address[](uint256(_path.length) / uint256(2) + 1);
        for (uint256 i; i < coins.length; i++) {
            coins[i] = _path[2 * i];
        }
        coins = _makeRoutePath(coins);
        swapParams = new uint256[3][](coins.length - 1);

        for (uint256 i; i < coins.length - 1; i++) {
            II4iPool WPool = II4iPool(_path[2 * i + 1]);
            uint256[3] memory tmp = [
                WPool.coinIndex(coins[i]),
                WPool.coinIndex(coins[i + 1]),
                uint256(poolTypes[_path[2 * i + 1]])
            ];
            swapParams[i] = tmp;
        }
    }

    function getDy(address[] calldata _path, uint256 _amount) external view override returns (uint256[] memory) {
        return I4iHelper.CurveRouter.getDy(_makeRoutePath(_path), _makeSwapParams(_path), _amount);
    }

    function getDyWithoutFee(address[] calldata _path, uint256 _amount)
        external
        view
        override
        returns (uint256[] memory)
    {
        return I4iHelper.CurveRouter.getDyWithoutFee(_makeRoutePath(_path), _makeSwapParams(_path), _amount);
    }

    function swapWithPath(
        address[] calldata _path,
        uint256 _amount,
        uint256 _minAmount
    ) external payable override returns (uint256 output) {
        if (_path[0] == address(0)) {
            require(msg.value == _amount, "msg.value is invalid");
        } else {
            IERC20(_path[0]).safeTransferFrom(_msgSender(), address(this), _amount);
            approveIfNeeded(_path[0], I4iHelper.router, _amount);
        }
        uint256[] memory outputs = I4iHelper.CurveRouter.swapWithPath{ value: msg.value }(
            _makeRoutePath(_path),
            _makeSwapParams(_path),
            _amount,
            _minAmount
        );
        output = outputs[outputs.length - 1];
    }

    function addLiquidityKLAY(
        address lpContract,
        address[] calldata coins,
        uint256[] calldata amounts,
        uint256 minAmount
    ) external payable override returns (uint256) {
        II4iPool WPool = II4iPool(lpContract);
        require(WPool.N_COINS() == coins.length && coins.length == amounts.length, "lengths are different");
        require(amounts[0] == msg.value, "msg.value and amount are diff!");
        for (uint256 i; i < coins.length; i++) {
            if (coins[i] != address(0)) {
                IERC20(coins[i]).transferFrom(_msgSender(), address(this), amounts[i]);
                approveIfNeeded(coins[i], lpContract, amounts[i]);
            }
        }
        address[] memory WCoins = _makeRoutePath(coins);
        uint256[] memory WAmounts = new uint256[](coins.length);
        for (uint256 i; i < coins.length; i++) {
            WAmounts[i] = amounts[WPool.coinIndex(WCoins[i])];
        }
        return WPool.addLiquidity(WAmounts, minAmount);
    }

    function addLiquidity(
        address lpContract,
        address[] calldata coins,
        uint256[] calldata amounts,
        uint256 minAmount
    ) external override returns (uint256) {
        II4iPool WPool = II4iPool(lpContract);
        require(WPool.N_COINS() == coins.length && coins.length == amounts.length, "lengths are different");
        for (uint256 i; i < coins.length; i++) {
            IERC20(coins[i]).transferFrom(_msgSender(), address(this), amounts[i]);
            approveIfNeeded(coins[i], lpContract, amounts[i]);
        }

        address[] memory WCoins = _makeRoutePath(coins);
        uint256[] memory WAmounts = new uint256[](coins.length);
        for (uint256 i; i < coins.length; i++) {
            WAmounts[i] = amounts[WPool.coinIndex(WCoins[i])];
        }
        return WPool.addLiquidity(WAmounts, minAmount);
    }

    function removeLiquidity(
        address lpContract,
        uint256 _amount,
        address[] calldata coins,
        uint256[] calldata minAmounts
    ) external override returns (uint256[] memory amounts) {
        II4iPool WPool = II4iPool(lpContract);
        require(WPool.N_COINS() == coins.length && coins.length == minAmounts.length, "lengths are different");
        address lpToken = IPoolRegistry(I4iHelper.poolRegistry).getLpToken(lpContract);
        IERC20(lpToken).transferFrom(_msgSender(), address(this), _amount);
        approveIfNeeded(lpToken, lpContract, _amount);

        address[] memory WCoins = _makeRoutePath(coins);
        uint256[] memory WMinAmounts = new uint256[](coins.length);
        for (uint256 i; i < coins.length; i++) {
            WMinAmounts[i] = minAmounts[WPool.coinIndex(WCoins[i])];
        }
        amounts = WPool.removeLiquidity(_amount, WMinAmounts);
        for (uint256 i; i < coins.length; i++) {
            IERC20(coins[i]).uniTransfer(_msgSender(), amounts[WPool.coinIndex(WCoins[i])]);
        }
    }

    function removeLiquidityOneToken(
        address lpContract,
        uint256 _amount,
        address coin,
        uint256 minAmount
    ) external override returns (uint256 amount) {
        II4iPool WPool = II4iPool(lpContract);
        address lpToken = IPoolRegistry(I4iHelper.poolRegistry).getLpToken(lpContract);
        IERC20(lpToken).transferFrom(_msgSender(), address(this), _amount);
        approveIfNeeded(lpToken, lpContract, _amount);
        if (coin == address(0)) {
            amount = WPool.removeLiquidityOneToken(_amount, WPool.coinIndex(this.WKLAY()), minAmount);
        } else {
            amount = WPool.removeLiquidityOneToken(_amount, WPool.coinIndex(coin), minAmount);
        }
        IERC20(coin).uniTransfer(_msgSender(), amount);
    }

    function poolInfo(address _pool) external view override returns (ICurveViewer memory) {
        IPoolRegistry poolRegistry = IPoolRegistry(I4iHelper.poolRegistry);
        IPoolRegistry.PoolInfo memory shortPoolInfo = poolRegistry.getPoolInfo(_pool);
        address token = poolRegistry.getLpToken(_pool);
        ITokenViewer memory tokenDesc = this.tokenInfo(token);
        II4iPool WPool = II4iPool(_pool);

        uint64[] memory fees = new uint64[](2);
        fees[0] = WPool.fee().toUint64();
        fees[1] = WPool.adminFee().toUint64();
        ICurveViewer memory Pool = ICurveViewer({
            poolType: shortPoolInfo.poolType,
            A: WPool.A(),
            totalSupply: IERC20Metadata(token).totalSupply(),
            tokenBalances: WPool.balanceList(),
            pool: token,
            tokenList: WPool.coinList(),
            fees: fees,
            decimals: tokenDesc.decimals,
            name: tokenDesc.name,
            symbol: tokenDesc.symbol
        });
        return Pool;
    }

    function poolInfos() external view override returns (ICurveViewer[] memory, uint256) {
        uint256 poolLength = this.poolNum();
        ICurveViewer[] memory _pools = new ICurveViewer[](poolLength);
        for (uint256 i; i < poolLength; i++) {
            _pools[i] = this.poolInfo(IPoolRegistry(I4iHelper.poolRegistry).poolList(i));
        }
        return (_pools, poolLength);
    }

    function tokenInfo(address token) external view override returns (ITokenViewer memory) {
        ITokenViewer memory Token;
        if (token == address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE)) {
            Token = ITokenViewer(address(0), 18, "KLAY", "KLAY");
        } else {
            Token = ITokenViewer(
                token,
                IERC20Metadata(token).decimals(),
                IERC20Metadata(token).name(),
                IERC20Metadata(token).symbol()
            );
        }

        return Token;
    }

    function tokenInfos() external view override returns (ITokenViewer[] memory) {
        address[] memory tokens = IPoolRegistry(I4iHelper.poolRegistry).getCoinList();
        ITokenViewer[] memory Tokens = new ITokenViewer[](tokens.length);

        for (uint256 i; i < tokens.length; i++) {
            Tokens[i] = this.tokenInfo(tokens[i]);
        }
        return Tokens;
    }
}
