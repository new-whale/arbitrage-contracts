// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import { IERC20Metadata } from "../intf/IERC20Metadata.sol";
import { IPoolRegistry, II4ISwapPool } from "../SmartRoute/intf/II4I.sol";

import "./intf/ICurvePoolInfoViewer.sol";

/*
 * @dev: for test only
 */
import "hardhat/console.sol";

contract I4IViewer is ICurvePoolInfoViewer {
    address public immutable registry;

    constructor(address _registry) {
        registry = _registry;
    }

    function getPoolInfo(address pool) public view override returns (CurvePoolInfo memory poolInfo) {
        IPoolRegistry poolRegistry = IPoolRegistry(registry);
        IPoolRegistry.PoolInfo memory shortPoolInfo = poolRegistry.getPoolInfo(pool);
        address lpToken = poolRegistry.getLpToken(pool);

        uint256[2] memory fees;
        fees[0] = II4ISwapPool(pool).fee();
        fees[1] = II4ISwapPool(pool).adminFee();

        require(shortPoolInfo.poolType != 3, "CRYPTO_POOL");

        uint256 isMeta = shortPoolInfo.poolType - 1;

        poolInfo = CurvePoolInfo({
            totalSupply: IERC20Metadata(lpToken).totalSupply(),
            A: II4ISwapPool(pool).A(),
            fees: fees,
            tokenBalances: II4ISwapPool(pool).balanceList(),
            pool: pool,
            lpToken: lpToken,
            tokenList: II4ISwapPool(pool).coinList(),
            isMeta: isMeta,
            decimals: IERC20Metadata(lpToken).decimals(),
            name: IERC20Metadata(lpToken).name(),
            symbol: IERC20Metadata(lpToken).symbol()
        });
    }

    function pools() external view returns (address[] memory) {
        address[] memory allPools = IPoolRegistry(registry).getPoolList();
        uint256 count = 0;
        for (uint i; i < allPools.length; i++) {
            if (IPoolRegistry(registry).getPoolInfo(allPools[i]).poolType != 3) {
                count++;
            }
        }

        address[] memory filtered = new address[](count);
        count = 0;
        for (uint i; i < allPools.length; i++) {
            if (IPoolRegistry(registry).getPoolInfo(allPools[i]).poolType != 3) {
                filtered[count] = allPools[i];
                count++;
            }
        }

        return filtered;
    }
}
