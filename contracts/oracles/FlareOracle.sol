// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IFlareContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/util-contracts/userInterfaces/IFlareContractRegistry.sol";
import {IFastUpdater} from "@flarenetwork/flare-periphery-contracts/coston2/ftso/userInterfaces/IFastUpdater.sol";

contract FlareOracle {
    IFlareContractRegistry internal contractRegistry;
    IFastUpdater internal ftsoV2;
    // Feed indexes: 0 = FLR/USD, 2 = BTC/USD, 9 = ETH/USD
    uint256[] public feedIndexes = [0, 2, 9];

    /**
     * Constructor initializes the FTSOv2 contract.
     * The contract registry is used to fetch the FTSOv2 contract address.
     */
    constructor() {
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
}
