// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {OApp, MessagingFee, Origin} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {MessagingReceipt} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppSender.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {OAppOptionsType3} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OAppOptionsType3.sol";

contract DstPool is OApp, OAppOptionsType3 {
    mapping(address => uint256) public depositedCollateral;

    address public collateralToken;
    uint32 public dstChainId;
    uint16 public constant SEND = 1;

    constructor(
        address _endpoint,
        address _delegate,
        address _collateralToken,
        uint32 _dstChainId
    ) OApp(_endpoint, _delegate) Ownable(_delegate) {
        collateralToken = _collateralToken;
        dstChainId = _dstChainId;
    }

    function quote(
        bytes memory _message,
        bytes calldata _extraSendOptions,
        bool _payInLzToken
    ) public view returns (MessagingFee memory totalFee) {
        bytes memory options = combineOptions(
            dstChainId,
            SEND,
            _extraSendOptions
        );
        MessagingFee memory fee = _quote(
            dstChainId,
            _message,
            options,
            _payInLzToken
        );
        totalFee.nativeFee += fee.nativeFee;
        totalFee.lzTokenFee += fee.lzTokenFee;
    }

    /// @dev requires approval from user
    function takeLoan(
        uint256 _collateralAmount,
        bytes calldata _extraSendOptions
    ) external payable returns (MessagingReceipt memory receipt) {
        IERC20(collateralToken).transferFrom(
            msg.sender,
            address(this),
            _collateralAmount
        );
        depositedCollateral[msg.sender] += _collateralAmount;

        bytes memory options = combineOptions(
            dstChainId,
            SEND,
            _extraSendOptions
        );

        bytes memory payload = abi.encode(msg.sender, _collateralAmount);
        MessagingFee memory fee = _quote(dstChainId, payload, options, false);

        receipt = _lzSend(
            dstChainId,
            payload,
            options,
            fee,
            payable(msg.sender)
        );
    }

    function _lzReceive(
        Origin calldata /*_origin*/,
        bytes32 /*_guid*/,
        bytes calldata payload,
        address /*_executor*/,
        bytes calldata /*_extraData*/
    ) internal override {
        address borrower = abi.decode(payload, (address));
        IERC20(collateralToken).approve(
            address(this),
            depositedCollateral[borrower]
        );
        IERC20(collateralToken).transfer(
            borrower,
            depositedCollateral[borrower]
        );
        delete depositedCollateral[borrower];
    }
}
