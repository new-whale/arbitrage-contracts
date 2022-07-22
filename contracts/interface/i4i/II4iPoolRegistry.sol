// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface II4iPoolRegistry {
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
