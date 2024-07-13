// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../interfaces/IChronicle.sol";
import "../interfaces/ISelfKisser.sol";

contract ChronicleOracle {
    IChronicle[] public chronicleOracles;
    ISelfKisser public immutable selfKisser;

    constructor(address[] memory chronicleAddresses, address selfKisser_) {
        selfKisser = ISelfKisser(selfKisser_);
        for (uint256 i = 0; i < chronicleAddresses.length; i++) {
            IChronicle chronicle = IChronicle(chronicleAddresses[i]);
            chronicleOracles.push(chronicle);
            selfKisser.selfKiss(address(chronicle));
        }
        // selfKisser.selfKiss(address(this));
    }

    function read() external view returns (uint256[] memory vals) {
        uint256[] memory values = new uint256[](chronicleOracles.length);
        for (uint256 i = 0; i < chronicleOracles.length; i++) {
            values[i] = chronicleOracles[i].read();
        }
        return values;
    }
}
