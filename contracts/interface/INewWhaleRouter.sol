// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.7;

/// @title Interface for making MultihopRouter
interface INewWhaleRouter {
    enum DexType {
        UNI2,
        CURVE
    }

    struct SwapRoute {
        SingleSwapRoute[] routes;
    }

    struct SingleSwapRoute {
        uint8 amountInNumerator;
        uint8 amountInDenominator;
        SingleDexSwapRoute[] routes;
    }

    struct SingleDexSwapRoute {
        uint8 dexId;
        address[] path;
    }

    struct DexInfo {
        uint8 dexId;
        DexType dexType;
        address router;
    }

    function swapToken(
        uint256 amountIn,
        uint256 minAmountOut,
        SwapRoute calldata swapRoute,
        address from,
        address to,
        uint256 deadline
    ) external payable returns (uint256 amountOut);

    function getAllDexes() external view returns (DexInfo[] memory dexes);

    function addDex(address dex, DexType dexType) external returns (DexInfo memory addedDex);
}
