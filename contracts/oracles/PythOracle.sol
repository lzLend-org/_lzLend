// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";

contract PythOracle {
    IPyth pyth;
    bytes32[] priceFeedIds;

    constructor(address _pyth, bytes32[] memory _priceFeedIds) {
        pyth = IPyth(_pyth);
        priceFeedIds = _priceFeedIds;
    }

    function updateFeeds(bytes[] calldata pythPriceUpdate) public payable {
        uint updateFee = pyth.getUpdateFee(pythPriceUpdate);
        pyth.updatePriceFeeds{value: updateFee}(pythPriceUpdate);
    }

    function read() public view returns (PythStructs.Price[] memory) {
        PythStructs.Price[] memory prices = new PythStructs.Price[](
            priceFeedIds.length
        );
        for (uint i = 0; i < priceFeedIds.length; i++) {
            // TODO: FIGURE OUT THE PRICE FEED IDS
            // uint updateFee = pyth.getUpdateFee(priceFeedIds[i]);
            // pyth.updatePriceFeeds{value: updateFee}(priceFeedIds[i]);
            prices[i] = pyth.getPrice(priceFeedIds[i]);
        }
        return prices;
    }
}
