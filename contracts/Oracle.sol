// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {OApp, MessagingFee, Origin} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {MessagingReceipt} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppSender.sol";

contract Oracle is OApp {
    uint256[] public pythPrices;
    uint256[] public flarePrices;
    uint256[] public chroniclePrices;

    uint256 public immutable TOLERANCE_PERCENT = 5;

    constructor(
        address _endpoint,
        address _delegate
    ) OApp(_endpoint, _delegate) Ownable(_delegate) {}

    function getPrice(uint256 index) external view returns (uint256) {
        require(
            index < pythPrices.length &&
                index < flarePrices.length &&
                index < chroniclePrices.length,
            "Index out of bounds"
        );

        uint256[] memory prices = new uint256[](3);
        prices[0] = pythPrices[index];
        prices[1] = flarePrices[index];
        prices[2] = chroniclePrices[index];

        // NOTE: THINGS DIDNT WORK OUT :(
        // // Check if prices are within TOLERANCE_PERCENT of each other
        // for (uint256 i = 0; i < prices.length; i++) {
        //     for (uint256 j = i + 1; j < prices.length; j++) {
        //         uint256 maxPrice = prices[i] > prices[j] ? prices[i] : prices[j];
        //         uint256 minPrice = prices[i] < prices[j] ? prices[i] : prices[j];
        //         require(maxPrice <= minPrice * (100 + TOLERANCE_PERCENT) / 100, "Prices are not within tolerance");
        //     }
        // }

        // Sort the prices array
        for (uint256 i = 0; i < prices.length - 1; i++) {
            for (uint256 j = i + 1; j < prices.length; j++) {
                if (prices[i] > prices[j]) {
                    uint256 temp = prices[i];
                    prices[i] = prices[j];
                    prices[j] = temp;
                }
            }
        }

        // Return the median price
        return prices[1];
    }

    function setPythPrice(uint256[] memory prices) public {
        pythPrices = prices;
    }

    function setFlarePrice(uint256[] memory prices) public {
        flarePrices = prices;
    }

    function setChroniclePrice(uint256[] memory prices) public {
        chroniclePrices = prices;
    }

    function _lzReceive(
        Origin calldata /*_origin*/,
        bytes32 /*_guid*/,
        bytes calldata payload,
        address /*_executor*/,
        bytes calldata /*_extraData*/
    ) internal override {
        (uint256 oracleId, uint256[] memory prices) = abi.decode(
            payload,
            (uint256, uint256[])
        );

        if (oracleId == 0) {
            pythPrices = prices;
        } else if (oracleId == 1) {
            flarePrices = prices;
        } else if (oracleId == 2) {
            chroniclePrices = prices;
        }
    }
}
