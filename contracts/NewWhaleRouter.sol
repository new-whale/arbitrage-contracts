// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;
import { ICurve } from "./interface/Curve.sol";
import { IUni2 } from "./interface/Uni2.sol";
import "./libraries/Ownable.sol";
import "./libraries/UniERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import { Address } from "./libraries/Address.sol";
import "./interface/INewWhaleRouter.sol";

contract NewWhaleRouter is INewWhaleRouter, Ownable, Pausable, ReentrancyGuard {
    using UniERC20 for IERC20;
    using SafeERC20 for IERC20;
    using Address for address;
    using EnumerableSet for EnumerableSet.AddressSet;

    mapping(address => bool) private isAllowedUser;

    mapping(uint256 => DexType) private _dexTypes;
    EnumerableSet.AddressSet private _dexRouters;

    constructor(
        address[] memory dexes,
        DexType[] memory dexTypes,
        address[] memory validAddrs
    ) {
        require(dexes.length == dexTypes.length, "dexes and dextypes length are diff");
        for (uint256 i; i < dexes.length; i++) {
            _addDex(dexes[i], dexTypes[i]);
        }
        addAllowedUser(msg.sender);
        addAllowedUser(address(this));

        for (uint256 i; i < validAddrs.length; i++) {
            addAllowedUser(validAddrs[i]);
        }
    }

    receive() external payable {}

    modifier ensure(uint256 deadline) {
        require(deadline >= block.timestamp, "NewWhaleRouter: EXPIRED");
        _;
    }

    modifier onlyAllowedUser() virtual {
        require(isAllowedUser[_msgSender()], "NOT_VALID");
        _;
    }

    function getTokenIn(SingleSwapRoute memory route) private pure returns (address tokenIn) {
        tokenIn = route.routes[0].path[0];
    }

    function getTokenOut(SingleSwapRoute memory route) private pure returns (address tokenOut) {
        tokenOut = route.routes[route.routes.length - 1].path[route.routes[route.routes.length - 1].path.length];
    }

    /// check whether the given swap route is valid
    function validateSwapRoute(SwapRoute memory swapRoute) private view returns (address tokenIn, address tokenOut) {
        tokenIn = getTokenIn(swapRoute.routes[0]);
        tokenOut = getTokenOut(swapRoute.routes[0]);

        for (uint256 i = 0; i < swapRoute.routes.length; i++) {
            SingleSwapRoute memory route = swapRoute.routes[i];
            require(getTokenIn(route) == tokenIn, "Different tokenIn");
            require(getTokenOut(route) == tokenOut, "Different tokenOut");

            require(route.amountInNumerator > 0, "amountIn must be greater than 0.");

            if (i == swapRoute.routes.length - 1) {
                require(route.amountInNumerator == route.amountInDenominator, "Must swap entire balance");
            } else {
                require(route.amountInNumerator < route.amountInDenominator, "amountIn must be less than 1.");
            }

            address prevTokenOut = tokenIn;
            for (uint256 j = 0; j < route.routes.length; j++) {
                SingleDexSwapRoute memory singleDexRoute = route.routes[j];

                require(prevTokenOut == singleDexRoute.path[0], "Token path not connected.");
                require(singleDexRoute.path.length >= 2, "Single dex path must be greater than or equal to 2.");
                require(singleDexRoute.dexId < _dexRouters.length(), "NOT_ADDED_DEX");

                prevTokenOut = singleDexRoute.path[singleDexRoute.path.length - 1];
            }
        }
    }

    /// @notice Add allowed user
    /// @param addr address of user
    function addAllowedUser(address addr) public onlyOwner {
        isAllowedUser[addr] = true;
    }

    /// @notice Remove allowed user
    /// @param addr address of user
    function removeAllowedUser(address addr) public onlyOwner {
        isAllowedUser[addr] = false;
    }

    /// Getter Function

    function getAllDexes() external view override returns (DexInfo[] memory dexes) {
        dexes = new DexInfo[](_dexRouters.length());
        for (uint8 i; i < _dexRouters.length(); i++) {
            dexes[i] = DexInfo(i, _dexTypes[i], _dexRouters.at(i));
        }
        return dexes;
    }

    function addDex(address dex, DexType dexType) external override onlyOwner returns (DexInfo memory addedDex) {
        _addDex(dex, dexType);
    }

    function _addDex(address dex, DexType dexType) internal {
        require(dex.isContract(), "following dex is not a contract");
        _dexTypes[_dexRouters.length()] = dexType;
        _dexRouters.add(dex);
    }

    function swapToken(
        uint256 amountIn,
        uint256 minAmountOut,
        SwapRoute calldata swapRoute,
        address from,
        address to,
        uint256 deadline
    ) external payable override onlyAllowedUser ensure(deadline) returns (uint256 amountOut) {
        (address tokenIn, address tokenOut) = validateSwapRoute(swapRoute);

        if (tokenIn != address(0)) {
            IERC20(tokenIn).safeTransferFrom(from, address(this), amountIn);
        } else {
            require(msg.value == amountIn, "msg.value and amountIn are different");
        }

        for (uint256 i = 0; i < swapRoute.routes.length; i++) {
            SingleSwapRoute memory singleRoute = swapRoute.routes[i];

            uint256 currentBalance = IERC20(tokenIn).uniBalanceOf(address(this));
            uint256 currentAmount = (currentBalance * singleRoute.amountInNumerator) / singleRoute.amountInDenominator;
            for (uint256 j = 0; j < singleRoute.routes.length; j++) {
                SingleDexSwapRoute memory singleDexRoute = singleRoute.routes[j];
                DexType dexType = _dexTypes[singleDexRoute.dexId];

                if (dexType == DexType.UNI2) {
                    currentAmount = _executeUni2Swap(currentAmount, singleDexRoute.path, singleDexRoute.dexId);
                } else if (dexType == DexType.CURVE) {
                    currentAmount = _executeCurveSwap(currentAmount, singleDexRoute.path, singleDexRoute.dexId);
                }
            }
        }

        uint256 totalAmountOut = IERC20(tokenOut).uniBalanceOf(address(this));
        require(totalAmountOut >= minAmountOut, "Slippage");

        IERC20(tokenOut).uniTransfer(to, totalAmountOut);
    }

    function _executeUni2Swap(
        uint256 amountIn,
        address[] memory path,
        uint8 dexId
    ) internal returns (uint256 amountOut) {
        if (path[0] == address(0)) {
            amountOut = IUni2(_dexRouters.at(dexId)).swapExactKlay{ value: amountIn }(
                // minAmount=1
                1,
                path
            );
        } else {
            approveIfNeeded(path[0], _dexRouters.at(dexId), amountIn);
            amountOut = IUni2(_dexRouters.at(dexId)).swapExactKct(
                amountIn,
                // minAmount=1
                1,
                path
            );
        }
    }

    function _executeCurveSwap(
        uint256 amountIn,
        address[] memory path,
        uint8 dexId
    ) internal returns (uint256 amountOut) {
        if (path[0] != address(0)) {
            approveIfNeeded(path[0], _dexRouters.at(dexId), amountIn);
        }
        // swap within pool
        amountOut = ICurve(_dexRouters.at(dexId)).swapWithPath(
            path,
            amountIn,
            // minAmount = 1
            1
        );
    }

    function approveIfNeeded(
        address token,
        address router,
        uint256 amount
    ) internal {
        if (!(token == address(0))) {
            uint256 allowance = IERC20(token).allowance(address(this), router);
            if (allowance < amount) {
                IERC20(token).safeApprove(router, type(uint256).max);
            }
        }
    }
}
