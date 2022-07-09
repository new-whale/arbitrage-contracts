// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "../interface/Uni2.sol";

// pala 0.2% swap fee
library PaladexHelper {
    address public constant router = 0x66EC1B0C3bf4C15a76289ac36098704aCD44170F;
    address public constant WKLAY = 0x2ff5f6dE2287CA3075232127277E53519A77947C;
    address public constant factory = 0xA25ba09d8837F6319cD65B2345c0bbEa99c39Cb1;
    address public constant viewer = 0x3c942AB09eAE84a5d6b179c50447819772314101;
    IPaladex public constant CPMMRouter = IPaladex(router);
    uint32 public constant fee = 2000;
}

interface palaViewer {
    struct PoolInfo {
        address pool;
        address token0;
        address token1;
        string name;
        string symbol;
        uint8 decimals;
        uint256 totalSupply;
        uint112 token0Reserve;
        uint112 token1Reserve;
        uint256 token0Balance;
        uint256 token1Balance;
    }

    struct TokenInfo {
        address token;
        string name;
        string symbol;
        uint8 decimals;
        uint256 totalSupply;
    }

    function poolInfo(address pool) external view returns (PoolInfo memory);

    function poolInfos() external view returns (PoolInfo[] memory);

    function tokenInfo(address token) external view returns (TokenInfo memory);

    function tokenInfos() external view returns (TokenInfo[] memory);
}

interface IPaladex {
    function getAmountsIn(uint256 amountOut, address[] calldata path) external view returns (uint256[] memory amounts);

    function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts);

    function swapExactKLAYForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function swapExactTokensForKLAY(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapKLAYForExactTokens(
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function swapTokensForExactKLAY(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

contract Paladex is Uni2 {
    using SafeERC20 for IERC20;
    using UniERC20 for IERC20;

    function WKLAY() external pure override returns (address) {
        return PaladexHelper.WKLAY;
    }

    function router() external pure override returns (address) {
        return PaladexHelper.router;
    }

    function factory() external pure override returns (address) {
        return PaladexHelper.factory;
    }

    function getAmountsOut(uint256 amountIn, address[] memory path)
        external
        view
        override
        returns (uint256[] memory amounts)
    {
        address[] memory uni2Path = _makeRoutePath(path);
        amounts = PaladexHelper.CPMMRouter.getAmountsOut(amountIn, uni2Path);
    }

    // **** SWAP ****
    // requires the initial amount to have already been sent to the first pair
    function _swap(
        uint256[] memory amounts,
        address[] memory path,
        address _to
    ) internal virtual {
        IUniswapV2Factory wFactory = IUniswapV2Factory(this.factory());

        for (uint256 i; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0, ) = UniswapV2Library.sortTokens(input, output);
            uint256 amountOut = amounts[i + 1];
            (uint256 amount0Out, uint256 amount1Out) = input == token0
                ? (uint256(0), amountOut)
                : (amountOut, uint256(0));
            address to = i < path.length - 2 ? wFactory.getPair(output, path[i + 2]) : _to;
            IUniswapV2Pair(wFactory.getPair(input, output)).swap(amount0Out, amount1Out, to, new bytes(0));
        }
    }

    function swapExactKlay(uint256 amountOutMin, address[] calldata path)
        external
        payable
        override
        whenNotPaused
        returns (uint256 output)
    {
        require(path[0] == address(0), "INPUT_SHOULD_BE_KLAY");
        address[] memory uni2Path = _makeRoutePath(path);
        uint256[] memory amounts = PaladexHelper.CPMMRouter.getAmountsOut(msg.value, uni2Path);
        output = amounts[amounts.length - 1];
        require(output >= amountOutMin, "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT");

        IWKLAY(PaladexHelper.WKLAY).deposit{ value: amounts[0] }();

        IERC20(uni2Path[0]).uniTransfer(
            IUniswapV2Factory(PaladexHelper.factory).getPair(uni2Path[0], uni2Path[1]),
            amounts[0]
        );

        if (path[path.length - 1] == address(0)) {
            _swap(amounts, uni2Path, address(this));
            IWKLAY(uni2Path[uni2Path.length - 1]).withdraw(amounts[amounts.length - 1]);
            IERC20(address(0)).uniTransfer(_msgSender(), amounts[amounts.length - 1]);
        } else {
            _swap(amounts, uni2Path, _msgSender());
        }
    }

    function swapExactKct(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path
    ) external override whenNotPaused returns (uint256 output) {
        require(path[0] != address(0), "INPUT_SHOULD_NOT_BE_KLAY");
        address[] memory uni2Path = _makeRoutePath(path);
        uint256[] memory amounts = PaladexHelper.CPMMRouter.getAmountsOut(amountIn, uni2Path);
        output = amounts[amounts.length - 1];
        require(output >= amountOutMin, "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT");

        IERC20(uni2Path[0]).safeTransferFrom(
            _msgSender(),
            IUniswapV2Factory(PaladexHelper.factory).getPair(uni2Path[0], uni2Path[1]),
            amounts[0]
        );

        if (path[path.length - 1] == address(0)) {
            _swap(amounts, uni2Path, address(this));
            IWKLAY(uni2Path[uni2Path.length - 1]).withdraw(amounts[amounts.length - 1]);
            IERC20(address(0)).uniTransfer(_msgSender(), amounts[amounts.length - 1]);
        } else {
            _swap(amounts, uni2Path, _msgSender());
        }
    }

    // **** ADD LIQUIDITY ****
    function _addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin
    ) internal returns (uint256 amountA, uint256 amountB) {
        // create the pair if it doesn't exist yet
        IUniswapV2Factory wFactory = IUniswapV2Factory(this.factory());

        if (wFactory.getPair(tokenA, tokenB) == address(0)) {
            wFactory.createPair(tokenA, tokenB);
        }
        (address token0, ) = UniswapV2Library.sortTokens(tokenA, tokenB);
        (uint256 reserve0, uint256 reserve1, ) = IUniswapV2Pair(wFactory.getPair(tokenA, tokenB)).getReserves();
        (uint256 reserveA, uint256 reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);

        if (reserveA == 0 && reserveB == 0) {
            (amountA, amountB) = (amountADesired, amountBDesired);
        } else {
            uint256 amountBOptimal = UniswapV2Library.quote(amountADesired, reserveA, reserveB);
            if (amountBOptimal <= amountBDesired) {
                require(amountBOptimal >= amountBMin, "UniswapV2Router: INSUFFICIENT_B_AMOUNT");
                (amountA, amountB) = (amountADesired, amountBOptimal);
            } else {
                uint256 amountAOptimal = UniswapV2Library.quote(amountBDesired, reserveB, reserveA);
                assert(amountAOptimal <= amountADesired);
                require(amountAOptimal >= amountAMin, "UniswapV2Router: INSUFFICIENT_A_AMOUNT");
                (amountA, amountB) = (amountAOptimal, amountBDesired);
            }
        }
    }

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
        IUniswapV2Factory wFactory = IUniswapV2Factory(this.factory());
        (amountA, amountB) = _addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, 1, 1);
        address pair = wFactory.getPair(tokenA, tokenB);
        IERC20(tokenA).safeTransferFrom(msg.sender, pair, amountA);
        IERC20(tokenB).safeTransferFrom(msg.sender, pair, amountB);
        liquidity = IUniswapV2Pair(pair).mint(to);
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
        IUniswapV2Factory wFactory = IUniswapV2Factory(this.factory());
        (amountToken, amountKLAY) = _addLiquidity(token, this.WKLAY(), amountTokenDesired, msg.value, 1, 1);
        address pair = wFactory.getPair(token, this.WKLAY());
        IERC20(token).safeTransferFrom(msg.sender, pair, amountToken);
        IWKLAY(this.WKLAY()).deposit{ value: amountKLAY }();
        IERC20(this.WKLAY()).safeTransfer(pair, amountKLAY);
        liquidity = IUniswapV2Pair(pair).mint(to);
        // refund dust eth, if any
        if (msg.value > amountKLAY) {
            (bool sent, ) = msg.sender.call{ value: msg.value - amountKLAY }("");
            require(sent, "Failed_To_Transfer_ETH");
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
        address pair = IUniswapV2Factory(this.factory()).getPair(tokenA, tokenB);
        IUniswapV2Pair(pair).transferFrom(msg.sender, pair, liquidity); // send liquidity to pair
        (uint256 amount0, uint256 amount1) = IUniswapV2Pair(pair).burn(to);
        (address token0, ) = UniswapV2Library.sortTokens(tokenA, tokenB);
        (amountA, amountB) = tokenA == token0 ? (amount0, amount1) : (amount1, amount0);
        require(amountA >= amountAMin, "UniswapV2Router: INSUFFICIENT_A_AMOUNT");
        require(amountB >= amountBMin, "UniswapV2Router: INSUFFICIENT_B_AMOUNT");
    }

    function removeLiquidityKLAY(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountKLAYMin,
        address to
    ) public virtual override returns (uint256 amountToken, uint256 amountKLAY) {
        (amountToken, amountKLAY) = removeLiquidity(
            token,
            this.WKLAY(),
            liquidity,
            amountTokenMin,
            amountKLAYMin,
            address(this)
        );
        IERC20(token).safeTransfer(to, amountToken);
        IWKLAY(this.WKLAY()).withdraw(amountKLAY);

        (bool sent, ) = payable(to).call{ value: amountKLAY }("");
        require(sent, "Failed_To_Transfer_ETH");
    }

    function poolInfo(address pool) external view override returns (IUni2Viewer memory) {
        palaViewer.PoolInfo memory rawPoolInfo = palaViewer(PaladexHelper.viewer).poolInfo(pool);

        address[] memory tokenList = new address[](2);
        uint256[] memory tokenBalances = new uint256[](2);
        tokenList[0] = rawPoolInfo.token0;
        tokenList[1] = rawPoolInfo.token1;
        tokenBalances[0] = rawPoolInfo.token0Balance;
        tokenBalances[1] = rawPoolInfo.token1Balance;
        uint64[] memory fees = new uint64[](1);
        fees[0] = PaladexHelper.fee;
        IUni2Viewer memory Pool = IUni2Viewer({
            pool: pool,
            tokenList: tokenList,
            tokenBalances: tokenBalances,
            name: rawPoolInfo.name,
            symbol: rawPoolInfo.symbol,
            decimals: rawPoolInfo.decimals,
            totalSupply: rawPoolInfo.totalSupply,
            fees: fees
        });
        return Pool;
    }

    function poolInfos() external view override returns (IUni2Viewer[] memory, uint256) {
        palaViewer.PoolInfo[] memory rawPoolInfos = palaViewer(PaladexHelper.viewer).poolInfos();
        IUni2Viewer[] memory Pools = new IUni2Viewer[](rawPoolInfos.length);
        uint64[] memory fees = new uint64[](1);
        fees[0] = PaladexHelper.fee;
        for (uint256 i; i < rawPoolInfos.length; i++) {
            address[] memory tokenList = new address[](2);
            uint256[] memory tokenBalances = new uint256[](2);
            tokenList[0] = rawPoolInfos[i].token0;
            tokenList[1] = rawPoolInfos[i].token1;
            tokenBalances[0] = rawPoolInfos[i].token0Balance;
            tokenBalances[1] = rawPoolInfos[i].token1Balance;

            Pools[i] = IUni2Viewer({
                pool: rawPoolInfos[i].pool,
                tokenList: tokenList,
                tokenBalances: tokenBalances,
                name: rawPoolInfos[i].name,
                symbol: rawPoolInfos[i].symbol,
                decimals: rawPoolInfos[i].decimals,
                totalSupply: rawPoolInfos[i].totalSupply,
                fees: fees
            });
        }
        return (Pools, Pools.length);
    }

    function tokenInfo(address token) external view override returns (ITokenViewer memory) {
        palaViewer.TokenInfo memory rawToken = palaViewer(PaladexHelper.viewer).tokenInfo(token);
        ITokenViewer memory Token = ITokenViewer(rawToken.token, rawToken.decimals, rawToken.name, rawToken.symbol);
        return Token;
    }

    function tokenInfos() external view override returns (ITokenViewer[] memory) {
        palaViewer.TokenInfo[] memory rawTokens = palaViewer(PaladexHelper.viewer).tokenInfos();
        ITokenViewer[] memory Tokens = new ITokenViewer[](rawTokens.length);
        for (uint256 i; i < rawTokens.length; i++) {
            Tokens[i] = ITokenViewer(rawTokens[i].token, rawTokens[i].decimals, rawTokens[i].name, rawTokens[i].symbol);
        }
        return Tokens;
    }
}
