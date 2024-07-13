// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MessagingReceipt} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppSender.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ISrcPool {
    struct PoolMetadata {
        uint32 dstChainId;
        address dstPoolAddress;
        address poolOwner;
        uint256 poolBalance;
        address poolToken;
        address collateralToken;
        uint256 ltv;
        uint256 apr;
        uint256 expiry;
    }

    struct Loan {
        uint256 amount;
        uint256 collateral;
        uint256 startTime;
        address borrower;
    }

    function poolMetadata() external view returns (PoolMetadata memory);

    function loans(address borrower) external view returns (Loan memory);

    function repayLoan() external returns (MessagingReceipt memory receipt);

    function deposit(uint256 _amount) external;

    function getRepaymentAmount(address _sender) external view returns (uint256);

    function getPoolMetadata() external view returns (PoolMetadata memory);
}
