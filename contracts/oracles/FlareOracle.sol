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

    // Feed indexes: 2 = BTC/USD, 9 = ETH/USD, 16 = USDC/USD
    uint256[] public feedIndexes = [2, 9, 16];
    uint16 public constant SEND = 1;

    uint32[] public dstIds;

    event MessageACK(string message, uint32 senderEid, bytes32 sender);

    /**
     * Constructor initializes the FTSOv2 contract.
     * The contract registry is used to fetch the FTSOv2 contract address.
     */
    constructor(
        address _endpoint,
        address _owner,
        uint32[] memory _dstIds
    ) OApp(_endpoint, _owner) Ownable(_owner) {
        contractRegistry = IFlareContractRegistry(
            0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019
        );
        ftsoV2 = IFastUpdater(
            contractRegistry.getContractAddressByName("FastUpdater")
        );
        dstIds = _dstIds;
    }

    function read() public view returns (uint256[] memory _feedValues) {
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
        bytes memory _message,
        bytes calldata _extraSendOptions,
        bool _payInLzToken
    ) public view returns (MessagingFee memory totalFee) {
        for (uint i = 0; i < dstIds.length; i++) {
            bytes memory options = combineOptions(
                dstIds[i],
                SEND,
                _extraSendOptions
            );
            MessagingFee memory fee = _quote(
                dstIds[i],
                _message,
                options,
                _payInLzToken
            );
            totalFee.nativeFee += fee.nativeFee;
            totalFee.lzTokenFee += fee.lzTokenFee;
        }
    }

    function readAndSend(
        bytes calldata _extraSendOptions // gas settings for A -> B
    ) public payable {
        uint256[] memory prices = read();

        bytes memory encodedMessage = abi.encode(1, prices); 
        // Calculate the total messaging fee required.
        MessagingFee memory totalFee = quote(
            encodedMessage,
            _extraSendOptions,
            false
        );
        require(msg.value >= totalFee.nativeFee, "Insufficient fee provided");

        uint256 totalNativeFeeUsed = 0;
        uint256 remainingValue = msg.value;

        for (uint i = 0; i < dstIds.length; i++) {
            bytes memory options = combineOptions(
                dstIds[i],
                SEND,
                _extraSendOptions
            );
            MessagingFee memory fee = _quote(
                dstIds[i],
                encodedMessage,
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
                dstIds[i],
                encodedMessage,
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

    /**
     * @notice Internal function to handle receiving messages from another chain.
     * @dev Decodes and processes the received message based on its type.
     * @param _origin Data about the origin of the received message.
     * @param message The received message content.
     */
    function _lzReceive(
        Origin calldata _origin,
        bytes32 /*guid*/,
        bytes calldata message,
        address, // Executor address as specified by the OApp.
        bytes calldata // Any extra data or options to trigger on receipt.
    ) internal override {
        string memory _data = abi.decode(message, (string));
        emit MessageACK(_data, _origin.srcEid, _origin.sender);
    }
}
