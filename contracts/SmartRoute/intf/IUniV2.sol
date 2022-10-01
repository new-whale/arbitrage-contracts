// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.15;

interface IUniswapV2Factory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint256);

    function feeTo() external view returns (address);

    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);

    function allPairs(uint256) external view returns (address pair);

    function allPairsLength() external view returns (uint256);

    // klayswap
    function getPoolAddress(uint256) external view returns (address pair);

    // klayswap
    function getPoolCount() external view returns (uint256);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;

    function setFeeToSetter(address) external;
}

interface IUniswapV2Viewer {
    function fee(address pool) external view returns (uint32);
}

interface IUniswapV2Pair {
    function name() external pure returns (string memory);

    function symbol() external pure returns (string memory);

    function decimals() external pure returns (uint8);

    function totalSupply() external view returns (uint256);

    function balanceOf(address owner) external view returns (uint256);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    function PERMIT_TYPEHASH() external pure returns (bytes32);

    function nonces(address owner) external view returns (uint256);

    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function MINIMUM_LIQUIDITY() external pure returns (uint256);

    function mint(address to) external returns (uint256 liquidity);

    function burn(address to) external returns (uint256 amount0, uint256 amount1);

    function swapFee() external view returns (uint32);

    function skim(address to) external;

    function sync() external;

    function initialize(address, address) external;

    function factory() external view returns (address);

    function swap(
        uint256 amount0Out,
        uint256 amount1Out,
        address to,
        bytes calldata data
    ) external;

    function getReserves()
        external
        view
        returns (
            uint112 reserve0,
            uint112 reserve1,
            uint32 blockTimestampLast
        );

    function token0() external view returns (address);

    function token1() external view returns (address);
}


interface IKlayswapExchange {
    function name() external view returns (string memory);

    function approve(address _spender, uint256 _value) external returns (bool);

    function tokenA() external view returns (address);

    function totalSupply() external view returns (uint256);

    function getCurrentPool() external view returns (uint256, uint256);

    function addKlayLiquidityWithLimit(
        uint256 amount,
        uint256 minAmountA,
        uint256 minAmountB
    ) external payable;

    function grabKlayFromFactory() external payable;

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool);

    function decimals() external view returns (uint8);

    function addKlayLiquidity(uint256 amount) external payable;

    function changeMiningRate(uint256 _mining) external;

    function userRewardSum(address) external view returns (uint256);

    function tokenB() external view returns (address);

    function exchangeNeg(address token, uint256 amount) external returns (uint256);

    function mining() external view returns (uint256);

    function changeFee(uint256 _fee) external;

    function balanceOf(address) external view returns (uint256);

    function miningIndex() external view returns (uint256);

    function symbol() external view returns (string memory);

    function removeLiquidity(uint256 amount) external;

    function transfer(address _to, uint256 _value) external returns (bool);

    function addKctLiquidity(uint256 amountA, uint256 amountB) external;

    function lastMined() external view returns (uint256);

    function claimReward() external;

    function estimateNeg(address token, uint256 amount) external view returns (uint256);

    function updateMiningIndex() external;

    function factory() external view returns (address);

    function exchangePos(address token, uint256 amount) external returns (uint256);

    function addKctLiquidityWithLimit(
        uint256 amountA,
        uint256 amountB,
        uint256 minAmountA,
        uint256 minAmountB
    ) external;

    function allowance(address, address) external view returns (uint256);

    function fee() external view returns (uint256);

    function estimatePos(address token, uint256 amount) external view returns (uint256);

    function userLastIndex(address) external view returns (uint256);

    function initPool(address to) external;

    function removeLiquidityWithLimit(
        uint256 amount,
        uint256 minAmountA,
        uint256 minAmountB
    ) external;
}
