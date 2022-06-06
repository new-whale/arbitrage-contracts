// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.7;
import "../libraries/UniERC20.sol";
import "./IAggregationExecutor.sol";

interface IAggregationRouterV1 {
    struct SwapDescription {
        IERC20 srcToken;
        IERC20 dstToken;
        address dstReceiver;
        uint256 amount;
        uint256 minReturnAmount;
        uint256 isBlock;
        bool isProfitFee;
    }

    struct ZapDescription {
        IERC20 lpToken;
        address dstReceiver;
        uint256 amount;
        uint256 minReturnAmount;
        uint8 dexType;
        uint8 dexId;
    }

    struct CurveAddLiquidityDescription {
        address[] tokens;
        uint256[] amounts;
        uint256 minReturnAmount;
    }

    struct Fees {
        uint256 initDst;
        uint256 guaranteedDst;
        uint256 feePayedAmount;
    }

    struct ZapPeriphery {
        uint256 lp;
        uint256 srcAmount;
        uint256 initDst;
    }

    struct SwapBytes {
        bytes data;
        bytes logicData;
        bytes compareData;
        bytes feeData;
    }

    function EISEN_502Bels(
        address caller,
        SwapDescription calldata desc,
        SwapBytes calldata swapBytes
    )
        external
        payable
        returns (
            uint256 returnAmount,
            uint256 userBuybackAmount,
            uint256 feePayed,
            uint256 gasLeft
        );
}
