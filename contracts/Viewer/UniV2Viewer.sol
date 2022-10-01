// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import { IERC20Metadata } from "../intf/IERC20Metadata.sol";
import { IUniswapV2Pair, IUniswapV2Factory, IKlayswapExchange } from "../SmartRoute/intf/IUniV2.sol";

import "./intf/IUniswapV2PoolInfoViewer.sol";

/*
 * @dev: for test only
 */
import "hardhat/console.sol";
import { EnumerableMap } from "../lib/EnumerableMap.sol";

contract UniV2Viewer is IUniswapV2PoolInfoViewer {
    using EnumerableMap for EnumerableMap.AddressToUintMap;
    EnumerableMap.AddressToUintMap private dexTofees;

    constructor(address[] memory factories, uint256[] memory fees) {
        require(factories.length == fees.length, "diff length");
        for (uint256 i; i < factories.length; i++) {
            dexTofees.set(factories[i], fees[i]);
        }
    }

    function fee(address pool) external view returns (uint32) {
        return uint32(dexTofees.get(IUniswapV2Pair(pool).factory()));
    }

    function getPoolInfo(address pool) public view override returns (UniswapV2PoolInfo memory) {
        IUniswapV2Pair uniswapV2Pair = IUniswapV2Pair(pool);
        address[] memory tokenList = new address[](2);

        try uniswapV2Pair.token0() returns (address token0) {
            tokenList[0] = token0;
        } catch {
            return getKspPoolInfo(pool);
        }

        tokenList[1] = uniswapV2Pair.token1();
        uint256[] memory tokenBalances = new uint256[](2);
        (tokenBalances[0], tokenBalances[1], ) = uniswapV2Pair.getReserves();
        uint32[] memory fees = new uint32[](1);

        fees[0] = this.fee(pool);
        return
            UniswapV2PoolInfo({
                totalSupply: uniswapV2Pair.totalSupply(),
                tokenBalances: tokenBalances,
                pool: pool,
                tokenList: tokenList,
                fees: fees,
                decimals: uniswapV2Pair.decimals(),
                name: uniswapV2Pair.name(),
                symbol: uniswapV2Pair.symbol()
            });
    }

    function getKspPoolInfo(address pool) private view returns (UniswapV2PoolInfo memory) {
        IKlayswapExchange exchange = IKlayswapExchange(pool);
        uint256 token0Balance;
        uint256 token1Balance;
        (token0Balance, token1Balance) = exchange.getCurrentPool();

        address[] memory tokenList = new address[](2);
        uint256[] memory tokenBalances = new uint256[](2);
        tokenList[0] = exchange.tokenA();
        tokenList[1] = exchange.tokenB();
        tokenBalances[0] = token0Balance;
        tokenBalances[1] = token1Balance;
        uint32[] memory fees = new uint32[](1);
        fees[0] = uint32(exchange.fee()) * 100;
        return UniswapV2PoolInfo({
            pool: pool,
            tokenList: tokenList,
            tokenBalances: tokenBalances,
            name: exchange.name(),
            symbol: exchange.symbol(),
            decimals: exchange.decimals(),
            totalSupply: exchange.totalSupply(),
            fees: fees
        });
    }

    function getPairInfo(address _factory, uint256 idx) public view returns (UniswapV2PoolInfo memory) {
        try IUniswapV2Factory(_factory).allPairs(idx) returns (address pool) {
            return getPoolInfo(pool);
        } catch {
            address pool = IUniswapV2Factory(_factory).getPoolAddress(idx);
            return getPoolInfo(pool);
        }
    }

    function allPairsLength(address _factory) external view returns (uint256) {
        try IUniswapV2Factory(_factory).allPairsLength() returns (uint256 count) {
            return count;
        } catch {
            return IUniswapV2Factory(_factory).getPoolCount();
        }
    }

    function pools(address _facotry) external view returns (address[] memory) {
        address[] memory _pools = new address[](IUniswapV2Factory(_facotry).allPairsLength());
        for (uint256 i; i < _pools.length; i++) {
            _pools[i] = IUniswapV2Factory(_facotry).allPairs(i);
        }
        return _pools;
    }
}
