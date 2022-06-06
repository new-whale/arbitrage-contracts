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
import "./interface/IAggregationExecutor.sol";
import "./interface/IEisenMultihopRouter.sol";

contract AggregationExecutor is IAggregationExecutor, IEisenMultihopRouter, Ownable, Pausable, ReentrancyGuard {
    using UniERC20 for IERC20;
    using SafeERC20 for IERC20;
    using Address for address;
    using EnumerableSet for EnumerableSet.AddressSet;

    mapping(address => uint8) private isValidAddr;

    address public devAddr = 0xD29A0Ce1Efb5B12b697d10B1Bd2F93Fc03c1f651;
    address public userBuybackAddr;

    uint8 public typeNum = 2;

    EnumerableSet.AddressSet private Uni2Dex;
    EnumerableSet.AddressSet private CurveDex;
    EnumerableSet.AddressSet private BalancerDex;
    EnumerableSet.AddressSet private Uni3Dex;
    EnumerableSet.AddressSet private DodoDex;
    EnumerableSet.AddressSet private KyberDMMDex;

    constructor(
        address[] memory dexes,
        uint8[] memory dexTypes,
        address[] memory validAddrs
    ) {
        require(dexes.length == dexTypes.length, "dexes and dextypes length are diff");
        for (uint256 i; i < dexes.length; i++) {
            _addDex(dexes[i], dexTypes[i]);
        }
        isValidAddr[msg.sender] = 1;
        isValidAddr[address(this)] = 1;

        for (uint256 i; i < validAddrs.length; i++) {
            isValidAddr[validAddrs[i]] = 1;
        }
    }

    receive() external payable {}

    event FeeChanged(uint256 feeRate, uint256 _feeRate);

    modifier isValidFrom() virtual {
        require(isValidAddr[_msgSender()] == 1, "NOT_VALID");
        _;
    }

    modifier isValidSwapSequencesBlock(
        Swap[][][] memory swapSequences,
        address tokenIn,
        address tokenOut
    ) virtual {
        address prevTokens;

        for (uint256 i = 0; i < swapSequences.length; i++) {
            address prevToken;
            for (uint256 j = 0; j < swapSequences[i].length; j++) {
                if (j == 0) {
                    prevTokens = tokenIn;
                } else {
                    prevTokens = prevToken;
                }
                BlockDescription memory blockDescription = BlockDescription(prevTokens, address(0), 0, 0);
                for (uint256 k = 0; k < swapSequences[i][j].length; k++) {
                    Swap memory swap = swapSequences[i][j][k];
                    InNOut memory miniBlock = InNOut(address(0), address(0));
                    if (swap.dexType == uint8(DexType.UNI2)) {
                        require(swap.dexId < Uni2Dex.length(), "NOT_ADDED_DEX");
                        Uni2Swap memory uni2Swap = abi.decode(swap.data, (Uni2Swap));
                        miniBlock.tokenIn = uni2Swap.path[0];
                        miniBlock.tokenOut = uni2Swap.path[uni2Swap.path.length - 1];
                    } else if (swap.dexType == uint8(DexType.CURVE)) {
                        require(swap.dexId < CurveDex.length(), "NOT_ADDED_DEX");
                        CurveSwap memory curveSwap = abi.decode(swap.data, (CurveSwap));
                        miniBlock.tokenIn = curveSwap.path[0];
                        miniBlock.tokenOut = curveSwap.path[curveSwap.path.length - 1];
                    } else {
                        revert("AggregationExecutor: Dex type not supported");
                    }
                    require(miniBlock.tokenIn == blockDescription.tokenIn, "token in is diff");

                    blockDescription.partAcc += swap.part;
                    if (k == 0) {
                        blockDescription.parts = swap.parts;
                        blockDescription.tokenOut = miniBlock.tokenOut;
                    } else {
                        require(blockDescription.parts == swap.parts, "Should be divided in the same number");
                        require(blockDescription.tokenOut == miniBlock.tokenOut, "Should be the same tokenOut");
                    }
                }
                /// sum of each amount of start coin and amount in should be the same
                require(
                    blockDescription.partAcc == blockDescription.parts,
                    "total amount of token is diff with sum of partial amount"
                );
                if (j == swapSequences[i].length - 1) {
                    require(blockDescription.tokenOut == tokenOut, "Should be the same tokenOut");
                } else {
                    prevToken = blockDescription.tokenOut;
                }
            }
        }
        _;
    }
    /// check whether the given data(swap sequences) is valid
    modifier isValidSwapSequences(
        Swap[][] memory swapSequences,
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) virtual {
        uint256 totalAmountIn;

        for (uint256 i = 0; i < swapSequences.length; i++) {
            for (uint256 j = 0; j < swapSequences[i].length; j++) {
                Swap memory swap = swapSequences[i][j];

                if (swap.dexType == uint8(DexType.UNI2)) {
                    require(swap.dexId < Uni2Dex.length(), "NOT_ADDED_DEX");
                    if ((j == 0) || j == swapSequences[i].length - 1) {
                        Uni2Swap memory uni2Swap = abi.decode(swap.data, (Uni2Swap));
                        if (j == 0) {
                            // Aggregate initial token in amount and check whether the start token is tokenIn
                            require(uni2Swap.path[0] == tokenIn, "token in is diff");
                            totalAmountIn += uni2Swap.amountIn;
                        } else {
                            // check whether the final token is tokenOut
                            require(uni2Swap.path[uni2Swap.path.length - 1] == tokenOut, "token out is diff");
                        }
                    }
                } else if (swap.dexType == uint8(DexType.CURVE)) {
                    require(swap.dexId < CurveDex.length(), "NOT_ADDED_DEX");
                    if (j == 0 || j == swapSequences[i].length - 1) {
                        CurveSwap memory curveSwap = abi.decode(swap.data, (CurveSwap));
                        if (j == 0) {
                            // Aggregate initial token in amount and check whether the start token is tokenIn
                            require(curveSwap.path[0] == tokenIn, "token in is diff");
                            totalAmountIn += curveSwap.amountIn;
                        } else {
                            // check whether the final token is tokenOut
                            require(curveSwap.path[curveSwap.path.length - 1] == tokenOut, "token out is diff");
                        }
                    }
                } else {
                    revert("AggregationExecutor: Dex type not supported");
                }
            }
        }
        /// sum of each amount of start coin and amount in should be the same
        require(totalAmountIn == amountIn, "total amount of token is diff with sum of partial amount");
        _;
    }

    /// @notice Set valid address
    /// @param valAddr add to valAddr to valid address
    function setValidAddr(address valAddr) public onlyOwner {
        isValidAddr[valAddr] = 1;
    }

    /// @notice Del addr
    /// @param valAddr delete valAddr in valid address
    function delValidAddr(address valAddr) public onlyOwner {
        isValidAddr[valAddr] = 0;
    }

    /// Getter Function

    /// @notice get added dex address of given dex type
    /// @param dexType dex type is defined in enum e.g.) uni2 - 0 / curve - 1
    /// @return dexes return all added dexes in given type
    function getDexTypeAddrs(uint8 dexType) external view override returns (address[] memory dexes) {
        if (dexType == uint8(DexType.UNI2)) {
            dexes = new address[](Uni2Dex.length());
            for (uint256 i; i < Uni2Dex.length(); i++) {
                dexes[i] = Uni2Dex.at(i);
            }
        } else if (dexType == uint8(DexType.CURVE)) {
            dexes = new address[](CurveDex.length());
            for (uint256 i; i < CurveDex.length(); i++) {
                dexes[i] = CurveDex.at(i);
            }
        } else {
            revert("AggregationExecutor: Dex type not supported");
        }
    }

    /// @notice get all added dex address
    /// @return dexes return all added dexes
    function getAllDexTypeAddrs() external view override returns (address[][] memory dexes) {
        dexes = new address[][](typeNum);
        for (uint8 i; i < typeNum; i++) {
            dexes[i] = this.getDexTypeAddrs(i);
        }
    }

    function getDexes(uint8 i) external view override returns (address[] memory dexes) {
        uint256 dexNum;
        if (i == uint8(DexType.UNI2)) {
            dexNum = Uni2Dex.length();
            dexes = new address[](dexNum);
            for (uint256 k; k < dexNum; k++) {
                dexes[k] = Uni2Dex.at(k);
            }
        } else if (i == uint8(DexType.CURVE)) {
            dexNum = CurveDex.length();
            dexes = new address[](dexNum);
            for (uint256 k; k < dexNum; k++) {
                dexes[k] = CurveDex.at(k);
            }
        } else {
            revert("AggregationExecutor: Dex type not supported");
        }
    }

    function getDexesAll() external view override returns (DexTypes[] memory dexes) {
        dexes = new DexTypes[](typeNum);
        for (uint8 i; i < typeNum; i++) {
            dexes[i] = DexTypes(this.getDexes(i), i);
        }
        return dexes;
    }

    function addDex(address dex, uint8 dexType) external override onlyOwner {
        _addDex(dex, dexType);
    }

    function _addDex(address dex, uint8 dexType) internal {
        require(dex.isContract(), "following dex is not a contract");
        if (dexType == uint8(DexType.UNI2)) {
            Uni2Dex.add(dex);
        } else if (dexType == uint8(DexType.CURVE)) {
            CurveDex.add(dex);
        } else {
            revert("AggregationExecutor: Dex type not supported");
        }
    }

    function addDexes(address[] calldata dexes, uint8[] calldata dexTypes) external override onlyOwner {
        require(dexes.length == dexTypes.length, "dexes and dextypes length are diff");
        for (uint256 i; i < dexes.length; i++) {
            _addDex(dexes[i], dexTypes[i]);
        }
    }

    function removeDex(address dex) external override onlyOwner {
        _removeDex(dex);
    }

    function _removeDex(address dex) internal {
        if (Uni2Dex.contains(dex)) {
            Uni2Dex.remove(dex);
        } else if (CurveDex.contains(dex)) {
            CurveDex.remove(dex);
        } else {
            revert("The dex was not added to storage");
        }
    }

    function removeDexes(address[] calldata dexes) external override onlyOwner {
        for (uint256 i; i < dexes.length; i++) {
            _removeDex(dexes[i]);
        }
    }

    function callBytes(
        uint256 mode,
        address srcSpender,
        bytes calldata data
    ) public payable override {
        if (mode == 0) {
            /// mode 0 is swap model
            SwapExecutorDescription memory swapExecutorDescription = abi.decode(data, (SwapExecutorDescription));
            this.batchSwapExactIn{ value: msg.value }(
                srcSpender,
                swapExecutorDescription.to,
                swapExecutorDescription.tokenIn,
                swapExecutorDescription.tokenOut,
                swapExecutorDescription.amountIn,
                swapExecutorDescription.swapSequences
            );
        } else if (mode == 1) {
            /// mode 1 is block swap model
            SwapExecutorDescriptionBlock memory swapExecutorDescription = abi.decode(
                data,
                (SwapExecutorDescriptionBlock)
            );
            this.batchSwapExactInBlock{ value: msg.value }(
                srcSpender,
                swapExecutorDescription.to,
                swapExecutorDescription.tokenIn,
                swapExecutorDescription.tokenOut,
                swapExecutorDescription.amountIn,
                swapExecutorDescription.swapSequences
            );
            // } else if (mode == 2) {
            //     /// mode 1 is zap in uni2
            //     Protocol memory service = abi.decode(data, (Protocol));
            //     _executeUni2AddLiquidity(service);
            // } else if (mode == 3) {
            //     /// mode 2 is curve addliquidity
            //     Protocol memory service = abi.decode(data, (Protocol));
            //     _executeCurveAddLiquidity(service);
            //     // } else if (mode == 4) {
            //     //     /// mode 3 is removeliquidity
            //     //     Protocol memory service = abi.decode(data, (Protocol));
            //     _executeRemoveLiquidity(service);
        } else {
            revert("The mode is not defined");
        }
    }

    // **** Add Liquidity ****
    /// @notice add liquidity to given pool
    /// @param protocolFunc this parameter is the explanation of where to add liquidity
    /// @return amountOut calculated token amount out
    // function _executeCurveAddLiquidity(Protocol memory protocolFunc)
    //     internal
    //     payable
    //     virtual
    //     isValidFrom
    //     returns (uint256 liquidity)
    // {
    //     require(protocolFunc.dexId < CurveDex.length(), "NOT_ADDED_DEX");
    //     if (protocolFunc.isKlayIn == 1) {
    //         liquidity = _executeCurveAddLiquidityKLAY(protocolFunc.data, protocolFunc.dexId);
    //     } else {
    //         liquidity = _executeCurveAddLiquidityKCT(protocolFunc.data, protocolFunc.dexId);
    //     }
    //     for (uint256 i; i < desc.tokens.length; i++) {
    //         if (IERC20(desc.tokens[i]).isETH()) {
    //             require(msg.value == desc.amounts[i], "msg.value and amountIn are diff");
    //         } else {
    //             if (desc.amounts[i] > 0) {
    //                 IERC20(desc.tokens[i]).safeTransferFrom(_msgSender(), address(this), desc.amounts[i]);
    //             }
    //         }
    //     }
    // }

    // function _executeUni2AddLiquidity(bytes memory data, uint8 dexId) internal returns (uint256 liquidity) {
    //     Uni2AddLiquidity memory uni2AddLiquidity = abi.decode(data, (Uni2AddLiquidity));
    //     if (uni2AddLiquidity.tokenA == address(0)) {
    //         IUni2(Uni2Dex.at(dexId)).addLiquidityKLAY{ value: uni2AddLiquidity.amountADesired }(
    //             uni2AddLiquidity.tokenB,
    //             uni2AddLiquidity.amountBDesired,
    //             uni2AddLiquidity.to
    //         );
    //     } else {
    //         if (uni2AddLiquidity.tokenB == address(0)) {}
    //     }
    //     approveIfNeeded(uni2AddLiquidity.tokenA, Uni2Dex.at(dexId), type(uint256).max);
    //     approveIfNeeded(uni2AddLiquidity.tokenB, Uni2Dex.at(dexId), type(uint256).max);

    //     (, , liquidity) = IUni2(Uni2Dex.at(dexId)).addLiquidity(
    //         uni2AddLiquidity.tokenA,
    //         uni2AddLiquidity.tokenB,
    //         uni2AddLiquidity.amountADesired,
    //         uni2AddLiquidity.amountBDesired,
    //         uni2AddLiquidity.to
    //     );
    // }

    // **** Remove Liquidity ****
    /// @notice remove liquidity to given pool
    /// @param protocolFunc this parameter is the explanation of where to remove liquidity
    /// @return amountOut calculated token amount out
    // function _executeRemoveLiquidity(Protocol memory protocolFunc, bool isKlayIn)
    //     internal
    //     virtual
    //     isValidFrom
    //     returns (uint256 amountOut)
    // {
    //     uint8 dexType = protocolFunc.dexType;
    //     if (swap.dexType == uint8(DexType.UNI2)) {
    //         require(protocolFunc.dexId < Uni2Dex.length(), "NOT_ADDED_DEX");
    //         if (isKlayIn) {
    //             liquidity = _executeUni2AddLiquidityKLAY(protocolFunc.data, protocolFunc.dexId);
    //         } else {
    //             liquidity = _executeUni2AddLiquidity(protocolFunc.data, protocolFunc.dexId);
    //         }
    //         amountOut = _executeUni2RemoveLiquidity(protocolFunc.data, protocolFunc.dexId);
    //     } else if (swap.dexType == uint8(DexType.CURVE)) {
    //         require(protocolFunc.dexId < CurveDex.length(), "NOT_ADDED_DEX");
    //         amountOut = _executeCurveRemoveLiquidity(protocolFunc.data, protocolFunc.dexId);
    //     } else {
    //         revert("AggregationExecutor: Dex type not supported");
    //     }

    //     IERC20(tokenIn).uniTransfer(_msgSender(), amountOut);
    // }

    // **** Get Amounts Out ****
    /// @notice calculate token amount out when swap sequences were given
    /// @param swapSequences this parameter is swap sequences set. Swap struct consists of data(for arbitrary call), dexType(for other AMM), dexId(dex identity within the same AMM type)
    /// @return amountOut calculated token amount out
    function executeSingleSwapExactIn(
        Swap[] memory swapSequences,
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external payable virtual override isValidFrom returns (uint256 amountOut) {
        if (tokenIn != address(0)) {
            IERC20(tokenIn).safeTransferFrom(_msgSender(), address(this), amountIn);
        }
        for (uint256 i = 0; i < swapSequences.length; i++) {
            Swap memory swap = swapSequences[i];

            if (swap.dexType == uint8(DexType.UNI2)) {
                if (i == 0 || i == swapSequences.length - 1) {
                    Uni2Swap memory uni2Swap = abi.decode(swap.data, (Uni2Swap));
                    if (i == 0) {
                        require(tokenIn == uni2Swap.path[0], "invalid std to dst swap sequences diff initial");
                    } else {
                        require(
                            tokenOut == uni2Swap.path[uni2Swap.path.length - 1],
                            "invalid std to dst swap sequences diff final"
                        );
                    }
                }
                amountOut = _executeUni2Swap(i, swap.data, amountOut, swap.dexId);
            } else if (swap.dexType == uint8(DexType.CURVE)) {
                if (i == 0 || i == swapSequences.length - 1) {
                    CurveSwap memory curveSwap = abi.decode(swap.data, (CurveSwap));
                    if (i == 0) {
                        require(tokenIn == curveSwap.path[0], "invalid std to dst swap sequences diff initial");
                    } else {
                        require(
                            tokenOut == curveSwap.path[curveSwap.path.length - 1],
                            "invalid std to dst swap sequences diff final"
                        );
                    }
                }
                amountOut = _executeCurveSwap(i, swap.data, amountOut, swap.dexId);
            }
        }
        IERC20(tokenIn).uniTransfer(_msgSender(), amountOut);
    }

    function calAndExecuteSingleSwapExactIn(
        Swap[] memory swapSequences,
        address tokenIn,
        uint256 amountIn
    ) external payable virtual override isValidFrom returns (uint256 amountOut) {
        if (amountIn < this.calSingleSwapExactIn(swapSequences)) {
            if (tokenIn != address(0)) {
                IERC20(tokenIn).safeTransferFrom(_msgSender(), address(this), amountIn);
            }
            for (uint256 i = 0; i < swapSequences.length; i++) {
                Swap memory swap = swapSequences[i];

                if (swap.dexType == uint8(DexType.UNI2)) {
                    amountOut = _executeUni2Swap(i, swap.data, amountOut, swap.dexId);
                } else if (swap.dexType == uint8(DexType.CURVE)) {
                    amountOut = _executeCurveSwap(i, swap.data, amountOut, swap.dexId);
                }
            }
        }
        IERC20(tokenIn).uniTransfer(_msgSender(), amountOut);
    }

    // **** Get Amounts Out ****
    /// @notice calculate token amount out when swap sequences were given
    /// @param swapSequences this parameter is swap sequences set. Swap struct consists of data(for arbitrary call), dexType(for other AMM), dexId(dex identity within the same AMM type)
    /// @return amountOut calculated token amount out
    function calSingleSwapExactIn(Swap[] memory swapSequences)
        external
        view
        virtual
        override
        returns (uint256 amountOut)
    {
        for (uint256 i = 0; i < swapSequences.length; i++) {
            Swap memory swap = swapSequences[i];

            if (swap.dexType == uint8(DexType.UNI2)) {
                require(swap.dexId < Uni2Dex.length(), "NOT_ADDED_DEX");
                amountOut = _calculateUni2Swap(i, swap.data, amountOut, swap.dexId);
            } else if (swap.dexType == uint8(DexType.CURVE)) {
                require(swap.dexId < CurveDex.length(), "NOT_ADDED_DEX");
                amountOut = _calculateCurveSwap(i, swap.data, amountOut, swap.dexId);
            } else {
                revert("AggregationExecutor: Dex type not supported");
            }
        }
    }

    function calbatchSwapExactInBlock(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        Swap[][][] memory swapSequences
    )
        public
        view
        virtual
        override
        isValidFrom
        isValidSwapSequencesBlock(swapSequences, tokenIn, tokenOut)
        returns (uint256 totalAmountOut)
    {
        uint256 prevTokenAmounts;
        for (uint256 i = 0; i < swapSequences.length; i++) {
            for (uint256 j = 0; j < swapSequences[i].length; j++) {
                uint256 amountOut;
                uint256 accAmount;

                if (j == 0) {
                    prevTokenAmounts = amountIn;
                }
                for (uint256 k = 0; k < swapSequences[i][j].length; k++) {
                    Swap memory swap = swapSequences[i][j][k];
                    uint256 input;
                    if (k != swapSequences[i][j].length - 1) {
                        input = (prevTokenAmounts * swap.part) / swap.parts;
                        accAmount += input;
                    } else {
                        /// for floating point error
                        input = prevTokenAmounts - accAmount;
                    }
                    if (swap.dexType == uint8(DexType.UNI2)) {
                        /// to execute input amount set k(index)=1
                        amountOut = _calculateUni2Swap(1, swap.data, input, swap.dexId);
                    } else if (swap.dexType == uint8(DexType.CURVE)) {
                        /// to execute input amount set k(index)=1
                        amountOut = _calculateCurveSwap(1, swap.data, input, swap.dexId);
                    } else {
                        revert("AggregationExecutor: Dex type not supported");
                    }

                    // This takes the amountOut of the last swap
                    if (j == swapSequences[i].length - 1) {
                        totalAmountOut += amountOut;
                    } else {
                        prevTokenAmounts = amountOut;
                    }
                }
            }
        }
    }

    function calMultihopBatchSwapExactIn(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        Swap[][] memory swapSequences
    )
        public
        view
        virtual
        override
        isValidFrom
        isValidSwapSequences(swapSequences, tokenIn, tokenOut, amountIn)
        returns (uint256 totalAmountOut)
    {
        for (uint256 i = 0; i < swapSequences.length; i++) {
            uint256 amountOut;

            for (uint256 j = 0; j < swapSequences[i].length; j++) {
                Swap memory swap = swapSequences[i][j];

                if (swap.dexType == uint8(DexType.UNI2)) {
                    amountOut = _calculateUni2Swap(j, swap.data, amountOut, swap.dexId);
                } else if (swap.dexType == uint8(DexType.CURVE)) {
                    amountOut = _calculateCurveSwap(j, swap.data, amountOut, swap.dexId);
                } else {
                    revert("AggregationExecutor: Dex type not supported");
                }
            }
            totalAmountOut = amountOut + totalAmountOut;
        }
    }

    // **** SWAP ****
    function batchSwapExactIn(
        address srcSpender,
        address to,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        Swap[][] memory swapSequences
    )
        external
        payable
        virtual
        override
        isValidFrom
        isValidSwapSequences(swapSequences, tokenIn, tokenOut, amountIn)
        returns (uint256 totalAmountOut)
    {
        uint256 totalAmountIn;
        if (tokenIn != address(0)) {
            IERC20(tokenIn).safeTransferFrom(srcSpender, address(this), amountIn);
        } else {
            require(msg.value == amountIn, "msg.value and amountIn are diff");
        }
        totalAmountIn = amountIn;

        for (uint256 i = 0; i < swapSequences.length; i++) {
            uint256 amountOut;
            for (uint256 j = 0; j < swapSequences[i].length; j++) {
                Swap memory swap = swapSequences[i][j];

                if (swap.dexType == uint8(DexType.UNI2)) {
                    amountOut = _executeUni2Swap(j, swap.data, amountOut, swap.dexId);
                } else if (swap.dexType == uint8(DexType.CURVE)) {
                    amountOut = _executeCurveSwap(j, swap.data, amountOut, swap.dexId);
                } else {
                    revert("AggregationExecutor: Dex type not supported");
                }
            }

            // This takes the amountOut of the last swap
            totalAmountOut = amountOut + totalAmountOut;
        }
        IERC20(tokenOut).uniTransfer(to, totalAmountOut);
    }

    function batchSwapExactInBlock(
        address srcSpender,
        address to,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        Swap[][][] memory swapSequences
    )
        external
        payable
        virtual
        override
        isValidFrom
        isValidSwapSequencesBlock(swapSequences, tokenIn, tokenOut)
        returns (uint256 totalAmountOut)
    {
        if (tokenIn != address(0)) {
            IERC20(tokenIn).safeTransferFrom(srcSpender, address(this), amountIn);
        } else {
            require(msg.value == amountIn, "msg.value and amountIn are diff");
        }
        uint256 prevTokenAmounts;
        for (uint256 i = 0; i < swapSequences.length; i++) {
            for (uint256 j = 0; j < swapSequences[i].length; j++) {
                uint256 amountOut;
                uint256 accAmount;

                if (j == 0) {
                    prevTokenAmounts = amountIn;
                }
                for (uint256 k = 0; k < swapSequences[i][j].length; k++) {
                    Swap memory swap = swapSequences[i][j][k];
                    uint256 input;
                    if (k != swapSequences[i][j].length - 1) {
                        input = (prevTokenAmounts * swap.part) / swap.parts;
                        accAmount += input;
                    } else {
                        /// for floating point error
                        input = prevTokenAmounts - accAmount;
                    }
                    if (swap.dexType == uint8(DexType.UNI2)) {
                        /// to execute input amount set k(index)=1
                        amountOut = _executeUni2Swap(1, swap.data, input, swap.dexId);
                    } else if (swap.dexType == uint8(DexType.CURVE)) {
                        /// to execute input amount set k(index)=1
                        amountOut = _executeCurveSwap(1, swap.data, input, swap.dexId);
                    } else {
                        revert("AggregationExecutor: Dex type not supported");
                    }

                    // This takes the amountOut of the last swap
                    if (j == swapSequences[i].length - 1) {
                        totalAmountOut += amountOut;
                    } else {
                        prevTokenAmounts = amountOut;
                    }
                }
            }
        }

        IERC20(tokenOut).uniTransfer(to, totalAmountOut);
    }

    function _calculateUni2Swap(
        uint256 index,
        bytes memory data,
        uint256 previousAmountOut,
        uint8 dexId
    ) internal view returns (uint256 amountOut) {
        Uni2Swap memory uni2Swap = abi.decode(data, (Uni2Swap));
        if (index > 0) {
            // Makes sure that on the second swap the output of the first was used
            // so there is not intermediate token leftover
            uni2Swap.amountIn = previousAmountOut;
        }
        uint256[] memory amountsOut = IUni2(Uni2Dex.at(dexId)).getAmountsOut(uni2Swap.amountIn, uni2Swap.path);
        amountOut = amountsOut[amountsOut.length - 1];
    }

    function _calculateCurveSwap(
        uint256 index,
        bytes memory data,
        uint256 previousAmountOut,
        uint8 dexId
    ) internal view returns (uint256 amountOut) {
        CurveSwap memory curveSwap = abi.decode(data, (CurveSwap));
        if (index > 0) {
            // Makes sure that on the second swap the output of the first was used
            // so there is not intermediate token leftover
            curveSwap.amountIn = previousAmountOut;
        }
        uint256[] memory amountsOut = ICurve(CurveDex.at(dexId)).getDy(curveSwap.path, curveSwap.amountIn);
        amountOut = amountsOut[amountsOut.length - 1];
    }

    function _executeUni2Swap(
        uint256 index,
        bytes memory data,
        uint256 previousAmountOut,
        uint8 dexId
    ) internal returns (uint256 amountOut) {
        Uni2Swap memory uni2Swap = abi.decode(data, (Uni2Swap));
        if (index > 0) {
            // Makes sure that on the second swap the output of the first was used
            // so there is not intermediate token leftover
            uni2Swap.amountIn = previousAmountOut;
        }

        if (uni2Swap.path[0] == address(0)) {
            amountOut = IUni2(Uni2Dex.at(dexId)).swapExactKlay{ value: uni2Swap.amountIn }(
                // minAmount=1
                1,
                uni2Swap.path
            );
        } else {
            approveIfNeeded(uni2Swap.path[0], Uni2Dex.at(dexId), uni2Swap.amountIn);
            amountOut = IUni2(Uni2Dex.at(dexId)).swapExactKct(
                uni2Swap.amountIn,
                // minAmount=1
                1,
                uni2Swap.path
            );
        }
    }

    function _executeCurveSwap(
        uint256 index,
        bytes memory data,
        uint256 previousAmountOut,
        uint8 dexId
    ) internal returns (uint256 amountOut) {
        CurveSwap memory curveSwap = abi.decode(data, (CurveSwap));

        if (index > 0) {
            // Makes sure that on the second swap the output of the first was used
            // so there is not intermediate token leftover
            curveSwap.amountIn = previousAmountOut;
        }

        if (curveSwap.path[0] != address(0)) {
            approveIfNeeded(curveSwap.path[0], CurveDex.at(dexId), curveSwap.amountIn);
        }
        //swap within pool
        amountOut = ICurve(CurveDex.at(dexId)).swapWithPath(
            curveSwap.path,
            curveSwap.amountIn,
            // minAmount = 1
            1
        );
    }

    function rescueFunds(IERC20 token, uint256 amount) external onlyOwner {
        token.uniTransfer(msg.sender, amount == 0 ? token.uniBalanceOf(address(this)) : amount);
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
