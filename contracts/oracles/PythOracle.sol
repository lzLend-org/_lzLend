// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import {OApp, MessagingFee, Origin} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {OAppOptionsType3} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OAppOptionsType3.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PythOracle is OApp, OAppOptionsType3 {
    IPyth pyth;
    bytes32[] priceFeedIds;
    uint16 public constant SEND = 1;

    uint32[] public dstIds;

    event MessageACK(string message, uint32 senderEid, bytes32 sender);

    constructor(
        address _endpoint,
        address _owner,
        uint32[] memory _dstIds,
        address _pyth,
        bytes32[] memory _priceFeedIds
    ) OApp(_endpoint, _owner) Ownable(_owner) {
        pyth = IPyth(_pyth);
        priceFeedIds = _priceFeedIds;
        dstIds = _dstIds;
    }

    function updateFeeds(bytes[] calldata pythPriceUpdate) public payable {
        uint updateFee = pyth.getUpdateFee(pythPriceUpdate);
        pyth.updatePriceFeeds{value: updateFee}(pythPriceUpdate);
    }

    function read() public view returns (uint256[] memory) {
        uint256[] memory prices = new uint256[](priceFeedIds.length);
        for (uint i = 0; i < priceFeedIds.length; i++) {
            PythStructs.Price memory priceStruct = pyth.getPriceUnsafe(
                priceFeedIds[i]
            );
            int256 price = int256(priceStruct.price);
            int256 expo = int256(priceStruct.expo);
            uint256 normalizedPrice = uint256(price) *
                (10 ** uint256(18 - expo));
            prices[i] = normalizedPrice;
        }
        return prices;
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
        bytes[] calldata pythPriceUpdate,
        bytes calldata _extraSendOptions // gas settings for A -> B
    ) public payable {
        updateFeeds(pythPriceUpdate);

        uint256[] memory prices = read();

        bytes memory encodedMessage = abi.encode(0, prices);
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
