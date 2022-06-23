// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.7;

import "./libraries/Ownable.sol";
import "./libraries/UniERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault is Ownable {
    using UniERC20 for IERC20;
    using SafeERC20 for IERC20;

    function deposit(address token, uint256 amount) public payable onlyOwner {
        if (token == address(0)) {
            assert(msg.value == amount);
        } else {
            IERC20(token).transferFrom(msg.sender, address(this), amount);
        }
    }

    function withdraw(address token, uint256 amount) public onlyOwner {
        IERC20(token).uniTransfer(msg.sender, amount);
    }

    constructor() {}
}
