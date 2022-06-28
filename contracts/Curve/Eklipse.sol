// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "../interface/Curve.sol";

// Eklipse 0.06% of output swap fee
library EklipseHelper {
    address public constant router = 0x0358D0bA60667a17e25473640f772DDC77175962;
    address public constant WKLAY = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    IEklipseRouter public constant CurveRouter = IEklipseRouter(router);
}

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

interface IEklipseRouter {
    function swap(
        address _fromAddress,
        address _toAddress,
        uint256 _inAmount,
        uint256 _minOutAmount,
        uint256 _deadline
    ) external returns (uint256 out);
}

contract Eklipse is Curve {
    using SafeERC20 for IERC20;
    using UniERC20 for IERC20;
    using SafeCast for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;

    address private _WKLAY = address(0);

    constructor() {
        // 3Moon pool base pool
        _addPool(0x4F5d9F3b17988aA047e6F1Bc511fEc0BF25691f4, 0xd83b9dFa49D6C6d2A69554576e712E45A8A13E49);
        poolTypes[0x4F5d9F3b17988aA047e6F1Bc511fEc0BF25691f4] = 1;
        // 3moon-kbusd meta pool
        _addPool(0xddA06aaB425a1A390c131F790A56AB3380e3B7EC, 0x9EE1cE4ccF4c0379e675d9A326d21aacDbB55F72);
        poolTypes[0xddA06aaB425a1A390c131F790A56AB3380e3B7EC] = 2;
        // 3moon-ksd meta pool
        _addPool(0x7f352a4332fAD433D381d700118f8C9b0A1E1abb, 0xa4D48E724c7F2267918B5155094FB01437980604);
        poolTypes[0x7f352a4332fAD433D381d700118f8C9b0A1E1abb] = 2;
        // 3moon-kcash meta pool
        _addPool(0xB1b782f2D30505e9984e37e00C6494437d94c223, 0x9D5b7671CdDbA4bb82E99fBcedf60C4D001Fe2EF);
        poolTypes[0xB1b782f2D30505e9984e37e00C6494437d94c223] = 2;
        // 3moon-PUSD meta pool
        _addPool(0xe59234EeDC854b3b37D48EFd8a529069C3990F83, 0x63C7d72963ED6e0C255835B606BEF55EBEB1b5f8);
        poolTypes[0xe59234EeDC854b3b37D48EFd8a529069C3990F83] = 2;
    }

    function setWKLAY(address newWKLAY) external onlyOwner {
        _WKLAY = newWKLAY;
    }

    function WKLAY() external view override returns (address) {
        return _WKLAY;
    }

    function router() external pure override returns (address) {
        return EklipseHelper.router;
    }

    function AOfPool(address pool) external view override returns (uint256 A) {
        return IEklipsePool(pool).getA();
    }

    function AOfPools() external view override returns (uint256[] memory A) {
        uint256[] memory As = new uint256[](_pools.pools.length());
        for (uint8 i; i < _pools.pools.length(); i++) {
            As[i] = this.AOfPool(_pools.pools.at(i));
        }
        return As;
    }

    function getDy(address[] calldata _path, uint256 _amount) external view override returns (uint256[] memory) {
        require(_path.length % 2 == 1, "path length is invalid");
        address[] memory coins = new address[](uint256(_path.length) / uint256(2) + 1);
        uint256[] memory amounts = new uint256[](coins.length);
        amounts[0] = _amount;
        for (uint256 i; i < coins.length; i++) {
            coins[i] = _path[2 * i];
        }
        coins = _makeRoutePath(coins);
        for (uint256 i; i < coins.length - 1; i++) {
            IEklipsePool WPool = IEklipsePool(_path[2 * i + 1]);
            amounts[i + 1] = WPool.calculateSwap(
                WPool.tokenIndexes(coins[i]),
                WPool.tokenIndexes(coins[i + 1]),
                amounts[i]
            );
        }

        return amounts;
    }

    function getDyWithoutFee(address[] calldata _path, uint256 _amount)
        external
        view
        override
        returns (uint256[] memory)
    {
        return this.getDy(_path, _amount);
    }

    function swapWithPath(
        address[] calldata _path,
        uint256 _amount,
        uint256 _minAmount
    ) external payable override returns (uint256 output) {
        if (_path[0] == address(0)) {
            require(msg.value == _amount, "msg.value is invalid");
        } else {
            IERC20(_path[0]).safeTransferFrom(_msgSender(), address(this), _amount);
            approveIfNeeded(_path[0], EklipseHelper.router, _amount);
        }
        address[] memory path = _makeRoutePath(_path);
        output = EklipseHelper.CurveRouter.swap(
            path[0],
            path[path.length - 1],
            _amount,
            _minAmount,
            block.timestamp + 3000
        );

        IERC20(path[path.length - 1]).uniTransfer(_msgSender(), output);
    }

    function addLiquidityKLAY(
        address lpContract,
        address[] calldata coins,
        uint256[] calldata amounts,
        uint256 minAmount
    ) external payable override returns (uint256) {
        IEklipsePool WPool = IEklipsePool(lpContract);
        require(WPool.getNumberOfTokens() == coins.length && coins.length == amounts.length, "lengths are different");
        require(amounts[0] == msg.value, "msg.value and amount are diff!");
        for (uint256 i; i < coins.length; i++) {
            if (coins[i] != address(0)) {
                IERC20(coins[i]).transferFrom(_msgSender(), address(this), amounts[i]);
                approveIfNeeded(coins[i], lpContract, amounts[i]);
            }
        }
        address[] memory WCoins = _makeRoutePath(coins);
        uint256[] memory WAmounts = new uint256[](coins.length);
        for (uint256 i; i < coins.length; i++) {
            WAmounts[i] = amounts[WPool.tokenIndexes(WCoins[i])];
        }
        return WPool.addLiquidity(WAmounts, minAmount, block.timestamp + 3000);
    }

    function addLiquidity(
        address lpContract,
        address[] calldata coins,
        uint256[] calldata amounts,
        uint256 minAmount
    ) external override returns (uint256) {
        IEklipsePool WPool = IEklipsePool(lpContract);
        require(WPool.getNumberOfTokens() == coins.length && coins.length == amounts.length, "lengths are different");
        for (uint256 i; i < coins.length; i++) {
            IERC20(coins[i]).transferFrom(_msgSender(), address(this), amounts[i]);
            approveIfNeeded(coins[i], lpContract, amounts[i]);
        }
        address[] memory WCoins = _makeRoutePath(coins);
        uint256[] memory WAmounts = new uint256[](coins.length);
        for (uint256 i; i < coins.length; i++) {
            WAmounts[i] = amounts[WPool.tokenIndexes(WCoins[i])];
        }
        return WPool.addLiquidity(WAmounts, minAmount, block.timestamp + 3000);
    }

    function removeLiquidity(
        address lpContract,
        uint256 _amount,
        address[] calldata coins,
        uint256[] calldata minAmounts
    ) external override returns (uint256[] memory amounts) {
        IEklipsePool WPool = IEklipsePool(lpContract);
        require(
            WPool.getNumberOfTokens() == coins.length && coins.length == minAmounts.length,
            "lengths are different"
        );
        address lpToken = WPool.getLpToken();
        IERC20(lpToken).transferFrom(_msgSender(), address(this), _amount);
        approveIfNeeded(lpToken, lpContract, _amount);

        address[] memory WCoins = _makeRoutePath(coins);
        uint256[] memory WMinAmounts = new uint256[](coins.length);
        for (uint256 i; i < coins.length; i++) {
            WMinAmounts[i] = minAmounts[WPool.tokenIndexes(WCoins[i])];
        }
        amounts = WPool.removeLiquidity(_amount, WMinAmounts, block.timestamp + 3000);
        for (uint256 i; i < coins.length; i++) {
            IERC20(coins[i]).uniTransfer(_msgSender(), amounts[WPool.tokenIndexes(WCoins[i])]);
        }
    }

    function removeLiquidityOneToken(
        address lpContract,
        uint256 _amount,
        address coin,
        uint256 minAmount
    ) external override returns (uint256 amount) {
        IEklipsePool WPool = IEklipsePool(lpContract);
        address lpToken = WPool.getLpToken();
        IERC20(lpToken).transferFrom(_msgSender(), address(this), _amount);
        approveIfNeeded(lpToken, lpContract, _amount);
        if (coin == address(0)) {
            amount = WPool.removeLiquidityOneToken(
                _amount,
                WPool.tokenIndexes(this.WKLAY()),
                minAmount,
                block.timestamp + 3000
            );
        } else {
            amount = WPool.removeLiquidityOneToken(
                _amount,
                WPool.tokenIndexes(coin),
                minAmount,
                block.timestamp + 3000
            );
        }

        IERC20(coin).uniTransfer(_msgSender(), amount);
    }

    function poolInfo(address pool) external view override returns (ICurveViewer memory) {
        uint256 idx = _pools.pools._inner._indexes[bytes32(uint256(uint160(pool)))] - 1;
        address token = _pools.tokens.at(idx);
        ITokenViewer memory tokenDesc = this.tokenInfo(token);
        IEklipsePool WPool = IEklipsePool(pool);

        (, uint256 fee, uint256 adminFee, , , , , ) = WPool.swapStorage();
        uint64[] memory fees = new uint64[](2);
        fees[0] = fee.toUint64();
        fees[1] = adminFee.toUint64();
        ICurveViewer memory Pool = ICurveViewer({
            poolType: poolTypes[pool],
            A: WPool.getA(),
            totalSupply: IERC20Metadata(token).totalSupply(),
            tokenBalances: WPool.getTokenBalances(),
            pool: pool,
            lpToken: token,
            tokenList: WPool.getTokens(),
            fees: fees,
            decimals: tokenDesc.decimals,
            name: tokenDesc.name,
            symbol: tokenDesc.symbol
        });
        return Pool;
    }

    function poolInfos() external view override returns (ICurveViewer[] memory, uint256) {
        uint256 poolLength = _pools.pools.length();
        ICurveViewer[] memory pools = new ICurveViewer[](poolLength);
        for (uint256 i; i < poolLength; i++) {
            pools[i] = this.poolInfo(_pools.pools.at(i));
        }
        return (pools, poolLength);
    }

    function tokenInfos() external view override returns (ITokenViewer[] memory) {
        uint256 poolNum = _pools.pools.length();
        uint256 tokenNum;
        uint256 validTokenNum;

        uint256[] memory tokenNums = new uint256[](poolNum);
        for (uint256 i; i < poolNum; i++) {
            IEklipsePool WPool = IEklipsePool(_pools.pools.at(i));

            tokenNums[i] = WPool.getNumberOfTokens();
            tokenNum += tokenNums[i];
        }

        dictTokenInfo memory tokenInfoDicts;
        tokenInfoDicts.key = new address[](tokenNum);
        tokenInfoDicts.flag = new uint16[](tokenNum);
        tokenInfoDicts.tokenInfo = new ITokenViewer[](tokenNum);

        uint256 tokenPointer;

        for (uint256 i; i < poolNum; i++) {
            IEklipsePool WPool = IEklipsePool(_pools.pools.at(i));
            address[] memory tokens = WPool.getTokens();

            for (uint256 j; j < tokens.length; j++) {
                if (tokens[j] != address(0)) {
                    uint16 flag;
                    for (uint256 k; k < tokenPointer; k++) {
                        if (tokenInfoDicts.key[k] == tokens[j]) {
                            flag = flag + tokenInfoDicts.flag[j];
                        }
                        if (flag == 1) break;
                    }
                    if (flag == 0) {
                        tokenInfoDicts.key[tokenPointer + j] = tokens[j];
                        tokenInfoDicts.flag[tokenPointer + j] = 1;
                        tokenInfoDicts.tokenInfo[tokenPointer + j] = this.tokenInfo(tokens[j]);
                        validTokenNum = validTokenNum + 1;
                    }
                }
            }
            tokenPointer += tokenNums[i];
        }

        ITokenViewer[] memory Tokens = new ITokenViewer[](validTokenNum);

        uint256 idx;
        for (uint256 i; idx < validTokenNum; i++) {
            if (tokenInfoDicts.flag[i] == 1) {
                Tokens[idx] = tokenInfoDicts.tokenInfo[i];
                idx = idx + 1;
            }
        }
        return Tokens;
    }
}
