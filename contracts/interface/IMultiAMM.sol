// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;

interface IMultiAMM {
    enum DexType {
        UNI2,
        CURVE,
        BALANCER,
        UNI3,
        DODO,
        KYBERDMM
        // STABLESWAP,
        // SADDLE
    }

    struct Swap {
        uint8 part;
        uint8 parts;
        uint8 dexType;
        //dexType:
        // 0: uniswapV2
        // 1: curve
        // 2: balancer
        // 3: uniswapV3
        // 4: dodo - proactive
        // 5: Kyber dmm
        // 6: stable swap
        // 7: saddle
        uint8 dexId;
        bytes data;
    }

    struct Protocol {
        uint8 dexType;
        //dexType:
        // 0: uniswapV2
        // 1: curve
        // 2: balancer
        // 3: uniswapV3
        // 4: dodo - proactive
        // 5: Kyber dmm
        // 6: stable swap
        uint8 dexId;
        bytes data;
        uint8 isKlayIn;
    }

    struct Uni2Swap {
        address[] path;
        uint256 amountIn;
    }

    struct Uni2AddLiquidity {
        address to;
        address tokenA;
        address tokenB;
        uint256 amountADesired;
        uint256 amountBDesired;
        uint256 minReturnAmount;
    }

    struct CurveSwap {
        address[] path;
        uint256 amountIn;
    }

    struct CurveAddLiquidity {
        address pool;
        uint256[] amounts;
    }
}
