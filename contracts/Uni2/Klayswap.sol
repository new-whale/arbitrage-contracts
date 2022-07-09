// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "../interface/Uni2.sol";

// ksp 0.3% swap fee -> 3000
library KSPHelper {
    address public constant router = 0xC6a2Ad8cC6e4A7E08FC37cC5954be07d499E7654;
    address public constant WKLAY = address(0);
    address public constant factory = 0xC6a2Ad8cC6e4A7E08FC37cC5954be07d499E7654;
    IKlayswap public constant CPMMRouter = IKlayswap(router);
    uint32 public constant fee = 3000;
}

interface IKlayswapExchange {
    function name() external view returns (string memory);

    function approve(address _spender, uint256 _value) external returns (bool);

    function tokenA() external view returns (address);

    function totalSupply() external view returns (uint256);

    function getCurrentPool() external view returns (uint256, uint256);

    function addKlayLiquidityWithLimit(
        uint256 amount,
        uint256 minAmountA,
        uint256 minAmountB
    ) external payable;

    function grabKlayFromFactory() external payable;

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool);

    function decimals() external view returns (uint8);

    function addKlayLiquidity(uint256 amount) external payable;

    function changeMiningRate(uint256 _mining) external;

    function userRewardSum(address) external view returns (uint256);

    function tokenB() external view returns (address);

    function exchangeNeg(address token, uint256 amount) external returns (uint256);

    function mining() external view returns (uint256);

    function changeFee(uint256 _fee) external;

    function balanceOf(address) external view returns (uint256);

    function miningIndex() external view returns (uint256);

    function symbol() external view returns (string memory);

    function removeLiquidity(uint256 amount) external;

    function transfer(address _to, uint256 _value) external returns (bool);

    function addKctLiquidity(uint256 amountA, uint256 amountB) external;

    function lastMined() external view returns (uint256);

    function claimReward() external;

    function estimateNeg(address token, uint256 amount) external view returns (uint256);

    function updateMiningIndex() external;

    function factory() external view returns (address);

    function exchangePos(address token, uint256 amount) external returns (uint256);

    function addKctLiquidityWithLimit(
        uint256 amountA,
        uint256 amountB,
        uint256 minAmountA,
        uint256 minAmountB
    ) external;

    function allowance(address, address) external view returns (uint256);

    function fee() external view returns (uint256);

    function estimatePos(address token, uint256 amount) external view returns (uint256);

    function userLastIndex(address) external view returns (uint256);

    function initPool(address to) external;

    function removeLiquidityWithLimit(
        uint256 amount,
        uint256 minAmountA,
        uint256 minAmountB
    ) external;
}

interface IKlayswap {
    function name() external view returns (string memory);

    function approve(address _spender, uint256 _value) external returns (bool);

    function balanceOf(address) external view returns (uint256);

    function transfer(address _to, uint256 _value) external returns (bool);

    function createFee() external view returns (uint256);

    function getPoolAddress(uint256 idx) external view returns (address);

    function getAmountData(uint256 si, uint256 ei)
        external
        view
        returns (
            uint256[] memory,
            uint256[] memory,
            uint256[] memory
        );

    function createKlayPool(
        address token,
        uint256 amount,
        uint256 fee
    ) external payable;

    function createKctPool(
        address tokenA,
        uint256 amountA,
        address tokenB,
        uint256 amountB,
        uint256 fee
    ) external;

    function exchangeKlayPos(
        address token,
        uint256 amount,
        address[] calldata path
    ) external payable;

    function exchangeKctPos(
        address tokenA,
        uint256 amountA,
        address tokenB,
        uint256 amountB,
        address[] calldata path
    ) external;

    function exchangeKlayNeg(
        address token,
        uint256 amount,
        address[] calldata path
    ) external payable;

    function exchangeKctNeg(
        address tokenA,
        uint256 amountA,
        address tokenB,
        uint256 amountB,
        address[] calldata path
    ) external;

    function getPoolCount() external view returns (uint256);

    function tokenToPool(address tokenA, address tokenB) external view returns (address);
}

contract Klayswap is Uni2 {
    using SafeERC20 for IERC20;
    using UniERC20 for IERC20;

    address KSP = 0xC6a2Ad8cC6e4A7E08FC37cC5954be07d499E7654;
    struct Remainder {
        uint256 tokenADust;
        uint256 tokenBDust;
        uint256 liquidity;
    }

    function WKLAY() external pure override returns (address) {
        return KSPHelper.WKLAY;
    }

    function router() external pure override returns (address) {
        return KSPHelper.router;
    }

    function factory() external pure override returns (address) {
        return KSPHelper.factory;
    }

    function _makeRoutePath(address[] memory _path) internal pure override returns (address[] memory) {
        require(_path.length >= 2, "PATH_LEN_IS_SHORT");
        address[] memory route = new address[](_path.length - 2);

        if (route.length != 0) {
            for (uint256 i; i < route.length; i++) {
                route[i] = _path[i + 1];
            }
        }
        return route;
    }

    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        override
        returns (uint256[] memory amounts)
    {
        require(path.length >= 2, "INVALID_PATH");
        amounts = new uint256[](path.length);
        amounts[0] = amountIn;
        for (uint256 i; i < path.length - 1; i++) {
            address pair = KSPHelper.CPMMRouter.tokenToPool(path[i], path[i + 1]);
            uint256 estimated = IKlayswapExchange(pair).estimatePos(path[i], amounts[i]);
            amounts[i + 1] = estimated;
        }
    }

    // **** SWAP ****
    function swapExactKlay(uint256 amountOutMin, address[] calldata path)
        external
        payable
        override
        whenNotPaused
        returns (uint256 output)
    {
        address[] memory kspPath = _makeRoutePath(path);
        output = this.getAmountsOut(msg.value, path)[path.length - 1];
        KSPHelper.CPMMRouter.exchangeKlayPos{ value: msg.value }(path[path.length - 1], amountOutMin, kspPath);

        IERC20(path[path.length - 1]).uniTransfer(_msgSender(), output);
    }

    function swapExactKct(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path
    ) external override whenNotPaused returns (uint256 output) {
        address[] memory kspPath = _makeRoutePath(path);

        // to reduce gas cost
        // output = this.getAmountsOut(amountIn, path)[path.length - 1];
        IERC20(path[0]).safeTransferFrom(_msgSender(), address(this), amountIn);

        approveIfNeeded(path[0], amountIn);

        KSPHelper.CPMMRouter.exchangeKctPos(path[0], amountIn, path[path.length - 1], amountOutMin, kspPath);

        output = IERC20(path[path.length - 1]).balanceOf(address(this));
        IERC20(path[path.length - 1]).uniTransfer(_msgSender(), output);
    }

    // **** ADD LIQUIDITY ****
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        address to
    )
        external
        override
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        )
    {
        IKlayswap wFactory = IKlayswap(this.factory());
        address pair = wFactory.tokenToPool(tokenA, tokenB);
        require(pair != address(0), "NO POOL EXIST!");

        Remainder memory remained = Remainder(
            IERC20(tokenA).balanceOf(address(this)),
            IERC20(tokenB).balanceOf(address(this)),
            IERC20(pair).balanceOf(address(this))
        );

        IERC20(tokenA).transferFrom(_msgSender(), address(this), amountADesired);
        IERC20(tokenB).transferFrom(_msgSender(), address(this), amountBDesired);

        approveIfNeeded(tokenA, pair, amountADesired);
        approveIfNeeded(tokenB, pair, amountBDesired);
        if (tokenA == IKlayswapExchange(pair).tokenA()) {
            IKlayswapExchange(pair).addKctLiquidity(amountADesired, amountBDesired);
        } else {
            IKlayswapExchange(pair).addKctLiquidity(amountBDesired, amountADesired);
        }
        remained.tokenADust = IERC20(tokenA).balanceOf(address(this)) - remained.tokenADust;
        remained.tokenBDust = IERC20(tokenB).balanceOf(address(this)) - remained.tokenBDust;
        remained.liquidity = IERC20(pair).balanceOf(address(this)) - remained.liquidity;
        if (remained.tokenADust > 0) {
            IERC20(tokenA).safeTransfer(to, remained.tokenADust);
        }
        if (remained.tokenBDust > 0) {
            IERC20(tokenB).safeTransfer(to, remained.tokenBDust);
        }
        if (remained.liquidity > 0) {
            IERC20(pair).safeTransfer(to, remained.liquidity);
        }
    }

    function addLiquidityKLAY(
        address token,
        uint256 amountTokenDesired,
        address to
    )
        external
        payable
        override
        returns (
            uint256 amountToken,
            uint256 amountKLAY,
            uint256 liquidity
        )
    {
        IKlayswap wFactory = IKlayswap(this.factory());
        address pair = wFactory.tokenToPool(token, address(0));
        require(pair != address(0), "NO POOL EXIST!");
        Remainder memory remained = Remainder(
            IERC20(token).balanceOf(address(this)),
            address(this).balance - msg.value,
            IERC20(pair).balanceOf(address(this))
        );

        IERC20(token).transferFrom(_msgSender(), address(this), amountTokenDesired);

        approveIfNeeded(token, pair, amountTokenDesired);

        IKlayswapExchange(pair).addKlayLiquidity{ value: msg.value }(amountTokenDesired);
        remained.tokenADust = IERC20(token).balanceOf(address(this)) - remained.tokenADust;
        remained.tokenBDust = address(this).balance - remained.tokenBDust;
        remained.liquidity = IERC20(pair).balanceOf(address(this)) - remained.liquidity;
        if (remained.tokenADust > 0) {
            IERC20(token).safeTransfer(to, remained.tokenADust);
        }
        if (remained.tokenBDust > 0) {
            (bool sent, ) = payable(to).call{ value: remained.tokenBDust }("");
            require(sent, "Failed_To_Transfer_ETH");
        }
        if (remained.liquidity > 0) {
            IERC20(pair).safeTransfer(to, remained.liquidity);
        }
    }

    // **** REMOVE LIQUIDITY ****
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to
    ) public virtual override returns (uint256 amountA, uint256 amountB) {
        IKlayswap wFactory = IKlayswap(this.factory());
        address pair = wFactory.tokenToPool(tokenA, tokenB);
        require(pair != address(0), "NO POOL EXIST!");
        Remainder memory remained = Remainder(
            IERC20(tokenA).balanceOf(address(this)),
            IERC20(tokenB).balanceOf(address(this)),
            0
        );

        IERC20(pair).transferFrom(_msgSender(), address(this), liquidity);
        approveIfNeeded(pair, pair, liquidity);
        if (tokenA == IKlayswapExchange(pair).tokenA()) {
            IKlayswapExchange(pair).removeLiquidityWithLimit(liquidity, amountAMin, amountBMin);
        } else {
            IKlayswapExchange(pair).removeLiquidityWithLimit(liquidity, amountBMin, amountAMin);
        }
        amountA = IERC20(tokenA).balanceOf(address(this)) - remained.tokenADust;
        amountB = IERC20(tokenB).balanceOf(address(this)) - remained.tokenBDust;

        IERC20(tokenA).safeTransfer(to, amountA);
        IERC20(tokenB).safeTransfer(to, amountB);
    }

    function removeLiquidityKLAY(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountKLAYMin,
        address to
    ) public virtual override returns (uint256 amountToken, uint256 amountKLAY) {
        IKlayswap wFactory = IKlayswap(this.factory());
        address pair = wFactory.tokenToPool(token, address(0));
        require(pair != address(0), "NO POOL EXIST!");
        Remainder memory remained = Remainder(IERC20(token).balanceOf(address(this)), address(this).balance, 0);
        IERC20(pair).transferFrom(_msgSender(), address(this), liquidity);

        approveIfNeeded(pair, pair, liquidity);
        if (token == IKlayswapExchange(pair).tokenA()) {
            IKlayswapExchange(pair).removeLiquidityWithLimit(liquidity, amountTokenMin, amountKLAYMin);
        } else {
            IKlayswapExchange(pair).removeLiquidityWithLimit(liquidity, amountKLAYMin, amountTokenMin);
        }
        amountToken = IERC20(token).balanceOf(address(this)) - remained.tokenADust;
        amountKLAY = address(this).balance - remained.tokenBDust;

        IERC20(token).safeTransfer(to, amountToken);

        (bool sent, ) = payable(to).call{ value: amountKLAY }("");
        require(sent, "Failed_To_Transfer_ETH");
    }

    function poolInfo(address pool) external view override returns (IUni2Viewer memory) {
        IKlayswapExchange WPool = IKlayswapExchange(pool);
        uint256 token0Balance;
        uint256 token1Balance;
        (token0Balance, token1Balance) = WPool.getCurrentPool();

        address[] memory tokenList = new address[](2);
        uint256[] memory tokenBalances = new uint256[](2);
        tokenList[0] = WPool.tokenA();
        tokenList[1] = WPool.tokenB();
        tokenBalances[0] = token0Balance;
        tokenBalances[1] = token1Balance;
        uint64[] memory fees = new uint64[](1);
        fees[0] = KSPHelper.fee;
        IUni2Viewer memory Pool = IUni2Viewer({
            pool: pool,
            tokenList: tokenList,
            tokenBalances: tokenBalances,
            name: WPool.name(),
            symbol: WPool.symbol(),
            decimals: WPool.decimals(),
            totalSupply: WPool.totalSupply(),
            fees: fees
        });
        return Pool;
    }

    function pools() external view override returns (address[] memory poolAddrs) {
        uint256 poolNum = IKlayswap(KSPHelper.factory).getPoolCount();

        poolAddrs = new address[](poolNum);
        for (uint256 i; i < poolNum; i++) {
            poolAddrs[i] = IKlayswap(KSPHelper.factory).getPoolAddress(i);
        }
    }

    function poolInfos() external view override returns (IUni2Viewer[] memory, uint256) {
        uint256 poolNum = IKlayswap(KSPHelper.factory).getPoolCount();
        IUni2Viewer[] memory pools = new IUni2Viewer[](poolNum);
        for (uint256 i; i < pools.length; i++) {
            pools[i] = this.poolInfo(IKlayswap(KSPHelper.factory).getPoolAddress(i));
        }
        return (pools, poolNum);
    }

    function tokenInfos() external view override returns (ITokenViewer[] memory) {
        uint256 poolNum = IKlayswap(KSPHelper.factory).getPoolCount();
        uint256 tokenNum;

        dictTokenInfo memory tokenInfoDicts;
        tokenInfoDicts.key = new address[](poolNum * 2);
        tokenInfoDicts.flag = new uint16[](poolNum * 2);
        tokenInfoDicts.tokenInfo = new ITokenViewer[](poolNum * 2);

        for (uint256 i; i < poolNum; i++) {
            IKlayswapExchange pool = IKlayswapExchange(IKlayswap(KSPHelper.factory).getPoolAddress(i));

            address token0 = pool.tokenA();
            address token1 = pool.tokenB();
            if (token0 != address(0)) {
                uint16 flag;
                for (uint256 j; j < i * 2; j++) {
                    if (tokenInfoDicts.key[j] == token0) {
                        flag = flag + tokenInfoDicts.flag[j];
                    }
                    if (flag == 1) break;
                }
                if (flag == 0) {
                    tokenInfoDicts.key[i * 2] = token0;
                    tokenInfoDicts.flag[i * 2] = 1;
                    tokenInfoDicts.tokenInfo[i * 2] = this.tokenInfo(token0);
                    tokenNum = tokenNum + 1;
                }
            }
            if (token1 != address(0)) {
                uint16 flag;
                for (uint256 j; j < i * 2; j++) {
                    if (tokenInfoDicts.key[j] == token1) {
                        flag = flag + tokenInfoDicts.flag[j];
                    }
                    if (flag == 1) break;
                }

                if (flag == 0) {
                    tokenInfoDicts.key[i * 2 + 1] = token1;
                    tokenInfoDicts.flag[i * 2 + 1] = 1;
                    tokenInfoDicts.tokenInfo[i * 2 + 1] = this.tokenInfo(token1);
                    tokenNum = tokenNum + 1;
                }
            }
        }

        ITokenViewer[] memory Tokens = new ITokenViewer[](tokenNum);

        uint256 idx;
        for (uint256 i; idx < tokenNum; i++) {
            if (tokenInfoDicts.flag[i] == 1) {
                Tokens[idx] = tokenInfoDicts.tokenInfo[i];
                idx = idx + 1;
            }
        }
        return Tokens;
    }
}
