// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {OApp, MessagingFee, Origin} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {MessagingReceipt} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppSender.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SrcPool is OApp {
    uint32 public dstChainId;
    uint256 public poolBalance;
    address public poolToken;
    address public collateralToken;
    uint256 public ltv;
    uint256 public apr;
    uint256 public expiry;

    struct Loan {
        uint256 amount;
        uint256 collateral;
        uint256 startTime;
        address borrower;
    }

    mapping(address => Loan) public loans;

    constructor(
        address _endpoint,
        address _delegate,
        uint32 _dstChainId,
        address _poolToken,
        address _collateralToken,
        uint256 _ltv,
        uint256 _apr,
        uint256 _expiry
    ) OApp(_endpoint, _delegate) Ownable(_delegate) {
        dstChainId = _dstChainId;
        poolToken = _poolToken;
        collateralToken = _collateralToken;
        ltv = _ltv;
        apr = _apr;
        expiry = _expiry;

        poolBalance = 0;
    }

    function repayLoan() external returns (MessagingReceipt memory receipt) {
        require(loans[msg.sender].amount > 0, "Pool: no loan to repay");
        require(block.timestamp <= expiry, "Pool: loan expired");
        require(
            IERC20(poolToken).balanceOf(msg.sender) >=
                getRepaymentAmount(msg.sender),
            "Pool: insufficient balance"
        );
        uint256 totalRepayment = getRepaymentAmount(msg.sender);
        poolBalance += totalRepayment;

        require(
            IERC20(poolToken).transferFrom(
                msg.sender,
                address(this),
                totalRepayment
            ),
            "Pool: transfer failed"
        );
        delete loans[msg.sender];

        bytes memory payload = abi.encode(msg.sender);
        receipt = _lzSend(
            dstChainId,
            payload,
            "",
            MessagingFee(0, 0),
            payable(msg.sender)
        );
    }

    /// @dev requires approval from user
    function deposit(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Pool: amount must be greater than 0");
        require(
            IERC20(poolToken).allowance(msg.sender, address(this)) >= _amount,
            "Pool: insufficient allowance"
        );
        require(
            IERC20(poolToken).balanceOf(msg.sender) >= _amount,
            "Pool: insufficient balance"
        );
        IERC20(poolToken).transferFrom(msg.sender, address(this), _amount);
        poolBalance += _amount;
    }

    function getRepaymentAmount(address _sender) public view returns (uint256) {
        Loan storage loan = loans[_sender];
        require(loan.amount > 0, "Pool: no loan to repay");

        uint256 interest = (loan.amount *
            apr *
            (block.timestamp - loan.startTime)) / (365 days * 100);
        return loan.amount + interest;
    }

    function _lzReceive(
        Origin calldata /*_origin*/,
        bytes32 /*_guid*/,
        bytes calldata payload,
        address /*_executor*/,
        bytes calldata /*_extraData*/
    ) internal override {
        // NOTE: TAKE OUT A LOAN
        (address borrower, uint256 collateral) = abi.decode(
            payload,
            (address, uint256)
        );
        // TODO: INSERT ORACLES HERE...
        uint256 loanAmount = (collateral * ltv) / 100;
        require(poolBalance >= loanAmount, "Pool: insufficient balance");
        loans[borrower] = Loan(
            loanAmount,
            collateral,
            block.timestamp,
            borrower
        );
        poolBalance -= loanAmount;
        IERC20(poolToken).transferFrom(address(this), borrower, loanAmount);
    }
}