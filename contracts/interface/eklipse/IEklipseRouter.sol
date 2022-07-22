// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IEklipseRouter {
    function swap(
        address _fromAddress,
        address _toAddress,
        uint256 _inAmount,
        uint256 _minOutAmount,
        uint256 _deadline
    ) external returns (uint256 out);
}
