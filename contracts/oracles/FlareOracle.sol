// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IFlareContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/util-contracts/userInterfaces/IFlareContractRegistry.sol";
import {IFastUpdater} from "@flarenetwork/flare-periphery-contracts/coston2/ftso/userInterfaces/IFastUpdater.sol";

import {OApp, MessagingFee, Origin} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {OAppOptionsType3} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OAppOptionsType3.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract FlareOracle is OApp, OAppOptionsType3 {
    IFlareContractRegistry internal contractRegistry;
    IFastUpdater internal ftsoV2;
    // Feed indexes: 0 = FLR/USD, 2 = BTC/USD, 9 = ETH/USD
    uint256[] public feedIndexes = [0, 2, 9];
    uint16 public constant SEND = 1;

    /**
     * Constructor initializes the FTSOv2 contract.
     * The contract registry is used to fetch the FTSOv2 contract address.
     */
    constructor(
        address _endpoint,
        address _owner
    ) OApp(_endpoint, _owner) Ownable(msg.sender) {
        contractRegistry = IFlareContractRegistry(
            0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019
        );
        ftsoV2 = IFastUpdater(
            contractRegistry.getContractAddressByName("FastUpdater")
        );
    }

    /**
     * Get the current value of the feeds.
     */
    function read() external view returns (uint256[] memory _feedValues) {
        (uint256[] memory feedValues, int8[] memory decimals, ) = ftsoV2
            .fetchCurrentFeeds(feedIndexes);

        for (uint256 i = 0; i < feedValues.length; i++) {
            if (decimals[i] < 18) {
                feedValues[i] =
                    feedValues[i] *
                    (10 ** (18 - uint8(decimals[i])));
            } else if (decimals[i] > 18) {
                feedValues[i] =
                    feedValues[i] /
                    (10 ** (uint8(decimals[i]) - 18));
            }
        }

        return feedValues;
    }

    function quote(
        uint32[] memory _dstEids,
        uint16 _msgType,
        string memory _message,
        bytes calldata _extraSendOptions,
        bool _payInLzToken
    ) public view returns (MessagingFee memory totalFee) {
        bytes memory encodedMessage = abi.encode(_message);

        for (uint i = 0; i < _dstEids.length; i++) {
            bytes memory options = combineOptions(
                _dstEids[i],
                _msgType,
                _extraSendOptions
            );
            MessagingFee memory fee = _quote(
                _dstEids[i],
                encodedMessage,
                options,
                _payInLzToken
            );
            totalFee.nativeFee += fee.nativeFee;
            totalFee.lzTokenFee += fee.lzTokenFee;
        }
    }

    function send(
        uint32[] memory _dstEids,
        uint16 _msgType,
        string memory _message,
        bytes calldata _extraSendOptions // gas settings for A -> B
    ) external payable {
        require(_msgType == SEND, "InvalidMessageType()");

        // Calculate the total messaging fee required.
        MessagingFee memory totalFee = quote(
            _dstEids,
            _msgType,
            _message,
            _extraSendOptions,
            false
        );
        require(msg.value >= totalFee.nativeFee, "Insufficient fee provided");

        // Encodes the message before invoking _lzSend.
        bytes memory _encodedMessage = abi.encode(_message);

        uint256 totalNativeFeeUsed = 0;
        uint256 remainingValue = msg.value;

        for (uint i = 0; i < _dstEids.length; i++) {
            bytes memory options = combineOptions(
                _dstEids[i],
                _msgType,
                _extraSendOptions
            );
            MessagingFee memory fee = _quote(
                _dstEids[i],
                _encodedMessage,
                options,
                false
            );

            totalNativeFeeUsed += fee.nativeFee;
            remainingValue -= fee.nativeFee;

            // Ensure the current call has enough allocated fee from msg.value.
            require(
                remainingValue >= 0,
                "Insufficient fee for this destination"
            );

            _lzSend(
                _dstEids[i],
                _encodedMessage,
                options,
                fee,
                payable(msg.sender)
            );
        }
    }

    function _payNative(
        uint256 _nativeFee
    ) internal override returns (uint256 nativeFee) {
        if (msg.value < _nativeFee) revert NotEnoughNative(msg.value);
        return _nativeFee;
    }
}
