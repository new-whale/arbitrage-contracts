// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "../interface/Uni2.sol";

// Roundrobin 0.3% swap fee
library RoundrobinHelper {
    address public constant router = 0xa0182322bbf8209B6B5983eDa3F2336215c5561d;
    address public constant WKLAY = 0xF01f433268C277535743231C95c8e46783746D30;
    address public constant factory = 0x01D43Af9c2A1e9c5D542c2299Fe5826A357Eb3fe;
    IRoundrobinRouter public constant CPMMRouter = IRoundrobinRouter(router);
    uint32 public constant fee = 3000;
}

interface IRoundrobinRouter {
    function factory() external pure returns (address);

    function WETH() external pure returns (address);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
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

    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function swapTokensForExactETH(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapETHForExactTokens(
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function quote(
        uint256 amountA,
        uint256 reserveA,
        uint256 reserveB
    ) external pure returns (uint256 amountB);

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) external pure returns (uint256 amountOut);

    function getAmountIn(
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut
    ) external pure returns (uint256 amountIn);

    function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts);

    function getAmountsIn(uint256 amountOut, address[] calldata path) external view returns (uint256[] memory amounts);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable;

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;
}

// 0.3%

contract Roundrobin is Uni2 {
    using SafeERC20 for IERC20;
    using UniERC20 for IERC20;

    function WKLAY() external pure override returns (address) {
        return RoundrobinHelper.WKLAY;
    }

    function router() external pure override returns (address) {
        return RoundrobinHelper.router;
    }

    function factory() external pure override returns (address) {
        return RoundrobinHelper.factory;
    }

    function getAmountsOut(uint256 amountIn, address[] memory path)
        external
        view
        override
        returns (uint256[] memory amounts)
    {
        address[] memory uni2Path = _makeRoutePath(path);
        amounts = RoundrobinHelper.CPMMRouter.getAmountsOut(amountIn, uni2Path);
    }

    // **** SWAP ****
    // requires the initial amount to have already been sent to the first pair
    function _swap(
        uint256[] memory amounts,
        address[] memory path,
        address _to
    ) internal virtual {
        for (uint256 i; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0, ) = UniswapV2Library.sortTokens(input, output);
            uint256 amountOut = amounts[i + 1];
            (uint256 amount0Out, uint256 amount1Out) = input == token0
                ? (uint256(0), amountOut)
                : (amountOut, uint256(0));
            address to = i < path.length - 2
                ? IUniswapV2Factory(RoundrobinHelper.factory).getPair(output, path[i + 2])
                : _to;
            IUniswapV2Pair(IUniswapV2Factory(RoundrobinHelper.factory).getPair(input, output)).swap(
                amount0Out,
                amount1Out,
                to,
                new bytes(0)
            );
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
        uint256[] memory amounts = RoundrobinHelper.CPMMRouter.getAmountsOut(msg.value, uni2Path);
        output = amounts[amounts.length - 1];
        require(output >= amountOutMin, "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT");

        IWKLAY(RoundrobinHelper.WKLAY).deposit{ value: amounts[0] }();

        IERC20(uni2Path[0]).uniTransfer(
            IUniswapV2Factory(RoundrobinHelper.factory).getPair(uni2Path[0], uni2Path[1]),
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
        uint256[] memory amounts = RoundrobinHelper.CPMMRouter.getAmountsOut(amountIn, uni2Path);
        output = amounts[amounts.length - 1];
        require(output >= amountOutMin, "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT");

        IERC20(uni2Path[0]).safeTransferFrom(
            _msgSender(),
            IUniswapV2Factory(RoundrobinHelper.factory).getPair(uni2Path[0], uni2Path[1]),
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
        IUniswapV2Pair WPool = IUniswapV2Pair(pool);
        uint112 token0Balance;
        uint112 token1Balance;
        (token0Balance, token1Balance, ) = WPool.getReserves();

        address[] memory tokenList = new address[](2);
        uint256[] memory tokenBalances = new uint256[](2);
        tokenList[0] = WPool.token0();
        tokenList[1] = WPool.token1();
        tokenBalances[0] = uint256(token0Balance);
        tokenBalances[1] = uint256(token1Balance);
        uint64[] memory fees = new uint64[](1);
        fees[0] = RoundrobinHelper.fee;
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

    function poolInfos() external view override returns (IUni2Viewer[] memory, uint256) {
        uint256 poolNum = IUniswapV2Factory(RoundrobinHelper.factory).allPairsLength();
        IUni2Viewer[] memory pools = new IUni2Viewer[](poolNum);
        for (uint256 i; i < poolNum; i++) {
            address Pool = IUniswapV2Factory(RoundrobinHelper.factory).allPairs(i);
            pools[i] = this.poolInfo(Pool);
        }
        return (pools, poolNum);
    }

    function tokenInfos() external view override returns (ITokenViewer[] memory) {
        uint256 poolNum = IUniswapV2Factory(RoundrobinHelper.factory).allPairsLength();
        uint256 tokenNum;

        dictTokenInfo memory tokenInfoDicts;
        tokenInfoDicts.key = new address[](poolNum * 2);
        tokenInfoDicts.flag = new uint16[](poolNum * 2);
        tokenInfoDicts.tokenInfo = new ITokenViewer[](poolNum * 2);

        for (uint256 i; i < poolNum; i++) {
            IUniswapV2Pair pool = IUniswapV2Pair(IUniswapV2Factory(RoundrobinHelper.factory).allPairs(i));

            address token0 = pool.token0();
            address token1 = pool.token1();
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
