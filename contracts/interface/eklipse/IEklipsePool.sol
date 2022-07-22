// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IEklipsePool {
    function getA() external view returns (uint256);

    function getAPrecise() external view returns (uint256);

    function getVirtualPrice() external view returns (uint256);

    function getNumberOfTokens() external view returns (uint256);

    function addLiquidity(
        uint256[] calldata amounts,
        uint256 minMintAmount,
        uint256 deadline
    ) external returns (uint256);

    function getLpToken() external view returns (address);

    function getTokens() external view returns (address[] memory);

    function getTokenBalances() external view returns (uint256[] memory);

    function getTokenBalance(uint8 index) external view returns (uint256);

    function tokenIndexes(address) external view returns (uint8);

    function getToken(uint8 i) external view returns (address);

    function calculateTokenAmount(uint256[] calldata amounts, bool deposit) external view returns (uint256);

    function calculateSwap(
        uint8 inIndex,
        uint8 outIndex,
        uint256 inAmount
    ) external view returns (uint256);

    function calculateRemoveLiquidity(address account, uint256 amount) external view returns (uint256[] memory);

    function calculateRemoveLiquidityOneToken(
        address account,
        uint256 amount,
        uint8 index
    ) external view returns (uint256);

    function swap(
        uint8 fromIndex,
        uint8 toIndex,
        uint256 inAmount,
        uint256 minOutAmount,
        uint256 deadline
    ) external returns (uint256);

    function getTokenPrecisionMultipliers() external view returns (uint256[] memory);

    function getTokenIndex(address token) external view returns (uint8 index);

    function removeLiquidity(
        uint256 lpAmount,
        uint256[] calldata minAmounts,
        uint256 deadline
    ) external returns (uint256[] memory);

    function removeLiquidityOneToken(
        uint256 lpAmount,
        uint8 index,
        uint256 minAmount,
        uint256 deadline
    ) external returns (uint256);

    function removeLiquidityImbalance(
        uint256[] calldata amounts,
        uint256 maxBurnAmount,
        uint256 deadline
    ) external returns (uint256);

    function swapStorage()
        external
        view
        returns (
            address lpToken,
            uint256 fee,
            uint256 adminFee,
            uint256 initialA,
            uint256 futureA,
            uint256 initialATime,
            uint256 futureATime,
            uint256 defaultWithdrawFee
        );
}
