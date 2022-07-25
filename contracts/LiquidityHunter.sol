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

contract LiquidityHunter {
    using SafeMath for uint256;
    using Math for uint256;

    // refer https://docs.claimswap.org/contract/address.
    IUniswapV2Factory private factory = IUniswapV2Factory(0x3679c3766E70133Ee4A7eb76031E49d3d1f2B50c);
    // IWKLAY private wklay = IWKLAY(0xe4f05A66Ec68B54A58B17c22107b02e0232cC817);
    // IERC20 private klap = IERC20(0xd109065ee17E2dC20b3472a4d4fB5907BD687D09);

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

    function buyToken(
        address baseToken,
        address quoteToken,
        address from,
        address to,
        uint256 priceNumer,
        uint256 priceDenom,
        uint256 maxAmountIn
    ) external returns (uint256 amountOut) {
        require(owner == to || allowances[from][to], "NOT_ALLOWED");
        address pool = factory.getPair(baseToken, quoteToken);
        require(pool != address(0), "POOL_NOT_EXISTS");

        if (maxAmountIn == 0) {
            maxAmountIn = IERC20(quoteToken).balanceOf(from);
        }

        uint256 reserveBase;
        uint256 reserveQuote;
        bool isBaseToken0 = baseToken < quoteToken;

        {
            (uint256 reserve0, uint256 reserve1, ) = IUniswapV2Pair(pool).getReserves();

            (reserveBase, reserveQuote) = isBaseToken0 ? (reserve0, reserve1) : (reserve1, reserve0);
        }

        // Buy scenario
        // Initial balance: reserveQuote(=rQ), reserveBase(=rB)
        // Buy amount: A
        // After buy: (rQ + A), (rQ * rB) / (rQ + A)
        // Price = (rQ + A)^2 / (rQ * rB) = (priceNumer / priceDenom)
        // (rQ + A) = sqrt((rQ * rB) * (priceNumer / priceDenom))
        uint256 targetReserveQuote = sqrtu(((reserveBase * reserveQuote) * priceNumer) / priceDenom);

        require(targetReserveQuote > reserveQuote, "NOT_BUYABLE");
        uint256 amountIn = maxAmountIn.min(targetReserveQuote - reserveQuote);
        amountOut = UniswapV2Library.getAmountOut(amountIn, reserveQuote, reserveBase);

        require(amountOut > 0, "AMOUNT_OUT");

        IERC20(quoteToken).transferFrom(from, pool, amountIn);
        IUniswapV2Pair(pool).swap(isBaseToken0 ? amountOut : 0, isBaseToken0 ? 0 : amountOut, to, new bytes(0));
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
        address pool = factory.getPair(baseToken, quoteToken);
        require(pool != address(0), "POOL_NOT_EXISTS");

        if (maxAmountIn == 0) {
            maxAmountIn = IERC20(baseToken).balanceOf(from);
        }

        uint256 reserveBase;
        uint256 reserveQuote;
        bool isBaseToken0 = baseToken < quoteToken;

        {
            (uint256 reserve0, uint256 reserve1, ) = IUniswapV2Pair(pool).getReserves();

            (reserveBase, reserveQuote) = isBaseToken0 ? (reserve0, reserve1) : (reserve1, reserve0);
        }

        // Sell scenario
        // Initial balance: reserveQuote(=rQ), reserveBase(=rB)
        // Sell amount: A
        // After sell: (rQ * rB) / (rB + A), (rB + A)
        // Price = (rQ * rB) / (rB + A)^2 = (priceNumer / priceDenom)
        // (rB + A) = sqrt((rQ * rB) * (priceDenom / priceNumer))
        uint256 targetReserveBase = sqrtu(((reserveBase * reserveQuote) * priceDenom) / priceNumer);

        require(targetReserveBase > reserveBase, "NOT_SELLABLE");
        uint256 amountIn = maxAmountIn.min(targetReserveBase - reserveBase);
        amountOut = UniswapV2Library.getAmountOut(amountIn, reserveBase, reserveQuote);

        require(amountOut > 0, "AMOUNT_OUT");

        IERC20(baseToken).transferFrom(from, pool, amountIn);
        IUniswapV2Pair(pool).swap(isBaseToken0 ? 0 : amountOut, isBaseToken0 ? amountOut : 0, to, new bytes(0));
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
