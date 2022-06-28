//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.7;

interface IViewer {
    struct IUni2Viewer {
        uint256 totalSupply;
        uint256[] tokenBalances;
        address pool;
        address[] tokenList;
        uint64[] fees;
        uint8 decimals;
        string name;
        string symbol;
    }
    struct ICurveViewer {
        uint64 poolType;
        uint256 A;
        uint256 totalSupply;
        uint256[] tokenBalances;
        address pool;
        address lpToken;
        address[] tokenList;
        uint64[] fees;
        uint8 decimals;
        string name;
        string symbol;
    }

    struct ITokenViewer {
        address token;
        uint8 decimals;
        string name;
        string symbol;
    }

    struct dictTokenInfo {
        address[] key;
        uint16[] flag;
        ITokenViewer[] tokenInfo;
    }

    function tokenInfo(address token) external view returns (ITokenViewer memory);

    function tokenInfos() external view returns (ITokenViewer[] memory);
}
