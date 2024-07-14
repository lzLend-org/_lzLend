// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {OApp, MessagingFee, Origin} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {MessagingReceipt} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppSender.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IOracle} from "./interfaces/oracles/IOracle.sol";
// import { ONFT721 } from "./onft721/ONFT721.sol";
// import {ONFT721} from "./onft721/ONFT721Simplified.sol";
import {OAppOptionsType3} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OAppOptionsType3.sol";

contract SrcPool is OApp, OAppOptionsType3 {
    uint16 public constant SEND = 1;

    struct PoolMetadata {
        uint32 dstChainId;
        address dstPoolAddress;
        address poolOwner;
        uint256 poolBalance;
        address poolToken;
        address oracleAddress;
        uint256[] oraclePricesIndex;
        address collateralToken;
        uint256 ltv;
        uint256 apr;
        uint256 expiry;
    }

    PoolMetadata public poolMetadata;

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
        address _dstPoolAddress,
        address _poolToken,
        address _oracleAddress,
        uint256[] memory _oraclePricesIndex,
        address _collateralToken,
        uint256 _ltv,
        uint256 _apr,
        uint256 _expiry
    ) OApp(_endpoint, _delegate) Ownable(_delegate) {
        poolMetadata.dstChainId = _dstChainId;
        poolMetadata.dstPoolAddress = _dstPoolAddress;
        poolMetadata.poolOwner = _delegate;
        poolMetadata.poolToken = _poolToken;
        poolMetadata.oracleAddress = _oracleAddress;
        poolMetadata.oraclePricesIndex = _oraclePricesIndex;
        poolMetadata.collateralToken = _collateralToken;
        poolMetadata.ltv = _ltv;
        poolMetadata.apr = _apr;
        poolMetadata.expiry = _expiry;

        poolMetadata.poolBalance = 0;
    }

    function quote(
        bytes memory _message,
        bytes calldata _extraSendOptions,
        bool _payInLzToken
    ) public view returns (MessagingFee memory totalFee) {
        bytes memory options = combineOptions(
            poolMetadata.dstChainId,
            SEND,
            _extraSendOptions
        );
        MessagingFee memory fee = _quote(
            poolMetadata.dstChainId,
            _message,
            options,
            _payInLzToken
        );
        totalFee.nativeFee += fee.nativeFee;
        totalFee.lzTokenFee += fee.lzTokenFee;
    }

    function repayLoan() external payable returns (MessagingReceipt memory receipt) {
        require(loans[msg.sender].amount > 0, "Pool: no loan to repay");
        require(block.timestamp <= poolMetadata.expiry, "Pool: loan expired");
        require(
            IERC20(poolMetadata.poolToken).balanceOf(msg.sender) >=
                getRepaymentAmount(msg.sender),
            "Pool: insufficient balance"
        );
        uint256 totalRepayment = getRepaymentAmount(msg.sender);
        poolMetadata.poolBalance += totalRepayment;

        require(
            IERC20(poolMetadata.poolToken).transferFrom(
                msg.sender,
                address(this),
                totalRepayment
            ),
            "Pool: transfer failed"
        );
        delete loans[msg.sender];

        bytes memory payload = abi.encode(msg.sender);
        receipt = _lzSend(
            poolMetadata.dstChainId,
            payload,
            "",
            MessagingFee(0, 0),
            payable(msg.sender)
        );
    }

    /// @dev requires approval from user
    function deposit(uint256 _amount) external {
        require(_amount > 0, "Pool: amount must be greater than 0");
        IERC20(poolMetadata.poolToken).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        poolMetadata.poolBalance += _amount;
    }

    function getRepaymentAmount(address _sender) public view returns (uint256) {
        Loan storage loan = loans[_sender];
        require(loan.amount > 0, "Pool: no loan to repay");

        uint256 interest = (loan.amount *
            poolMetadata.apr *
            (block.timestamp - loan.startTime)) / (10000 * 365 days);

        return loan.amount + interest;
    }

    function getLoanAmount(
        uint256 collateral
    ) public view returns (uint256 loanAmount) {
        uint256 poolPrice = IOracle(poolMetadata.oracleAddress).getPrice(
            poolMetadata.oraclePricesIndex[0]
        );
        uint256 debtPrice = IOracle(poolMetadata.oracleAddress).getPrice(
            poolMetadata.oraclePricesIndex[1]
        );

        loanAmount =
            (collateral * debtPrice * poolMetadata.ltv) /
            (poolPrice * 10000);
    }

    function _lzReceive(
        Origin calldata /*_origin*/,
        bytes32 /*_guid*/,
        bytes calldata payload,
        address /*_executor*/,
        bytes calldata /*_extraData*/
    ) internal override {
        (address borrower, uint256 collateral) = abi.decode(
            payload,
            (address, uint256)
        );

        uint256 loanAmount = getLoanAmount(collateral);

        require(
            poolMetadata.poolBalance >= loanAmount,
            "Pool: insufficient balance"
        );
        loans[borrower] = Loan(
            loanAmount,
            collateral,
            block.timestamp,
            borrower
        );
        poolMetadata.poolBalance -= loanAmount;

        IERC20(poolMetadata.poolToken).approve(address(this), loanAmount);
        IERC20(poolMetadata.poolToken).transfer(
            borrower,
            loanAmount
        );
    }

    function getPoolMetadata() external view returns (PoolMetadata memory) {
        return poolMetadata;
    }
}
