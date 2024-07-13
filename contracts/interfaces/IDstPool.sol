// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MessagingReceipt} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppSender.sol";
import {Origin} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";

interface IDstPool {
    function depositedCollateral(address user) external view returns (uint256);

    function collateralToken() external view returns (address);

    function dstChainId() external view returns (uint32);

    function takeLoan(uint256 _collateralAmount) external returns (MessagingReceipt memory receipt);

    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata payload,
        address _executor,
        bytes calldata _extraData
    ) external;
}
