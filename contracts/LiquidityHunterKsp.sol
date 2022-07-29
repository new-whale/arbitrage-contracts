// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;
import "./interface/IUniswapV2Factory.sol";
import "./interface/IUniswapV2Pair.sol";
import "./interface/IWKLAY.sol";
import "./libraries/UniERC20.sol";
import { Address } from "./libraries/Address.sol";
import "./libraries/UniswapV2Library.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

interface IKSP {
    function exchangeKlayPos(
        address token,
        uint256 amount,
        address[] memory path
    ) external payable;

    function exchangeKctPos(
        address tokenA,
        uint256 amountA,
        address tokenB,
        uint256 amountB,
        address[] memory path
    ) external;

    function exchangeKlayNeg(
        address token,
        uint256 amount,
        address[] memory path
    ) external payable;

    function exchangeKctNeg(
        address tokenA,
        uint256 amountA,
        address tokenB,
        uint256 amountB,
        address[] memory path
    ) external;

    function tokenToPool(address tokenA, address tokenB) external view returns (address);

    function poolExist(address pool) external view returns (bool);
}

interface IKspPool {
    function getCurrentPool() external view returns (uint256, uint256);

    function tokenA() external view returns (address);

    function tokenB() external view returns (address);

    function estimatePos(address token, uint256 amount) external view returns (uint256);
}

contract LiquidityHunterKsp {
    using SafeMath for uint256;
    using Math for uint256;

    IKSP private ksp = IKSP(0xC6a2Ad8cC6e4A7E08FC37cC5954be07d499E7654);

    mapping(address => mapping(address => bool)) public allowances;
    address private owner;

    constructor() {
        owner = msg.sender;
    }

    function approve(
        address from,
        address to,
        bool isAllow
    ) public {
        allowances[from][to] = isAllow;
    }

    error DebugInfo(uint256 amountIn, uint256 amountOut);

    function buyToken(
        address baseToken,
        address quoteToken,
        address from,
        address to,
        uint256 priceNumer,
        uint256 priceDenom,
        uint256 maxAmountIn
    ) external returns (uint256 amountOut) {
        require(from == to || owner == to || allowances[from][to], "NOT_ALLOWED");
        address pool = ksp.tokenToPool(baseToken, quoteToken);
        require(ksp.poolExist(pool), "POOL_NOT_EXISTS");

        if (maxAmountIn == 0) {
            maxAmountIn = IERC20(quoteToken).balanceOf(from);
        }

        // Buy scenario
        // Initial balance: reserveQuote(=rQ), reserveBase(=rB)
        // Buy amount: A
        // After buy: (rQ + A), (rQ * rB) / (rQ + A)
        // Price = (rQ + A)^2 / (rQ * rB) = (priceNumer / priceDenom)
        // (rQ + A) = sqrt((rQ * rB) * (priceNumer / priceDenom))
        uint256 amountIn;
        {
            uint256 reserveBase;
            uint256 reserveQuote;
            bool isBaseToken0 = IKspPool(pool).tokenA() == baseToken;

            {
                (uint256 reserve0, uint256 reserve1) = IKspPool(pool).getCurrentPool();

                (reserveBase, reserveQuote) = isBaseToken0 ? (reserve0, reserve1) : (reserve1, reserve0);
            }

            uint256 targetReserveQuote = sqrtu(((reserveBase * reserveQuote) * priceNumer) / priceDenom);

            require(targetReserveQuote > reserveQuote, "NOT_BUYABLE");
            amountIn = maxAmountIn.min(targetReserveQuote - reserveQuote);
        }
        amountOut = IKspPool(pool).estimatePos(quoteToken, amountIn);

        require(amountOut > 0, "AMOUNT_OUT");

        IERC20(quoteToken).transferFrom(from, address(this), amountIn);
        IERC20(quoteToken).approve(address(ksp), amountIn);

        {
            address[] memory path = new address[](0);

            ksp.exchangeKctPos(quoteToken, amountIn, baseToken, amountOut, path);
        }

        IERC20(baseToken).transfer(to, amountOut);
    }

    function sellToken(
        address baseToken,
        address quoteToken,
        address from,
        address to,
        uint256 priceNumer,
        uint256 priceDenom,
        uint256 maxAmountIn
    ) external returns (uint256 amountOut) {
        require(owner == to || allowances[from][to], "NOT_ALLOWED");
        address pool = ksp.tokenToPool(baseToken, quoteToken);
        require(ksp.poolExist(pool), "POOL_NOT_EXISTS");

        if (maxAmountIn == 0) {
            maxAmountIn = IERC20(baseToken).balanceOf(from);
        }

        // Sell scenario
        // Initial balance: reserveQuote(=rQ), reserveBase(=rB)
        // Sell amount: A
        // After sell: (rQ * rB) / (rB + A), (rB + A)
        // Price = (rQ * rB) / (rB + A)^2 = (priceNumer / priceDenom)
        // (rB + A) = sqrt((rQ * rB) * (priceDenom / priceNumer))
        uint256 amountIn;
        {
            uint256 reserveBase;
            uint256 reserveQuote;
            bool isBaseToken0 = baseToken < quoteToken;

            {
                (uint256 reserve0, uint256 reserve1) = IKspPool(pool).getCurrentPool();

                (reserveBase, reserveQuote) = isBaseToken0 ? (reserve0, reserve1) : (reserve1, reserve0);
            }

            uint256 targetReserveBase = sqrtu(((reserveBase * reserveQuote) * priceDenom) / priceNumer);

            require(targetReserveBase > reserveBase, "NOT_SELLABLE");
            amountIn = maxAmountIn.min(targetReserveBase - reserveBase);
        }
        amountOut = IKspPool(pool).estimatePos(baseToken, amountIn);

        require(amountOut > 0, "AMOUNT_OUT");

        IERC20(baseToken).transferFrom(from, address(this), amountIn);
        IERC20(baseToken).approve(address(ksp), amountIn);

        {
            address[] memory path = new address[](2);

            ksp.exchangeKctPos(baseToken, amountIn, quoteToken, amountOut, path);
        }

        IERC20(quoteToken).transfer(to, amountOut);
    }

    /**
     * Calculate sqrt (x) rounding down, where x is unsigned 256-bit integer
     * number.
     *
     * @param x unsigned 256-bit integer number
     * @return unsigned 128-bit integer number
     */
    function sqrtu(uint256 x) public pure returns (uint128) {
        unchecked {
            if (x == 0) return 0;
            else {
                uint256 xx = x;
                uint256 r = 1;
                if (xx >= 0x100000000000000000000000000000000) {
                    xx >>= 128;
                    r <<= 64;
                }
                if (xx >= 0x10000000000000000) {
                    xx >>= 64;
                    r <<= 32;
                }
                if (xx >= 0x100000000) {
                    xx >>= 32;
                    r <<= 16;
                }
                if (xx >= 0x10000) {
                    xx >>= 16;
                    r <<= 8;
                }
                if (xx >= 0x100) {
                    xx >>= 8;
                    r <<= 4;
                }
                if (xx >= 0x10) {
                    xx >>= 4;
                    r <<= 2;
                }
                if (xx >= 0x8) {
                    r <<= 1;
                }
                r = (r + x / r) >> 1;
                r = (r + x / r) >> 1;
                r = (r + x / r) >> 1;
                r = (r + x / r) >> 1;
                r = (r + x / r) >> 1;
                r = (r + x / r) >> 1;
                r = (r + x / r) >> 1; // Seven iterations should be enough
                uint256 r1 = x / r;
                return uint128(r < r1 ? r : r1);
            }
        }
    }
}
