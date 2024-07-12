// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {OApp, MessagingFee, Origin} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {MessagingReceipt} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppSender.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DstPool is OApp {
    mapping(address => uint256) public depositedCollateral;

    address public collateralToken;
    uint32 public dstChainId;

    constructor(
        address _endpoint,
        address _delegate,
        address _collateralToken,
        uint32 _dstChainId
    ) OApp(_endpoint, _delegate) Ownable(_delegate) {
        collateralToken = _collateralToken;
        dstChainId = _dstChainId;
    }

    /// @dev requires approval from user
    function takeLoan(
        uint256 _collateralAmount
    ) external returns (MessagingReceipt memory receipt) {
        IERC20(collateralToken).transferFrom(
            msg.sender,
            address(this),
            _collateralAmount
        );
        depositedCollateral[msg.sender] += _collateralAmount;

        bytes memory payload = abi.encode(msg.sender, _collateralAmount);
        receipt = _lzSend(
            dstChainId,
            payload,
            "",
            MessagingFee(0, 0),
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
        require(
            IERC20(collateralToken).transferFrom(
                address(this),
                borrower,
                depositedCollateral[borrower]
            ),
            "DstPool: transfer failed"
        );
        delete depositedCollateral[borrower];
    }
}