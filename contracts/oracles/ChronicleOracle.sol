// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title OracleReader
 * @notice A simple contract to read from Chronicle oracles
 * @dev Addresses in this contract are hardcoded for the Sepolia testnet.
 * For other supported networks, check https://chroniclelabs.org/dashboard/oracles.
 */
contract OracleReader {
    ///  @notice The Chronicle ETH/USD oracle.
    IChronicle public immutable chronicle;

    /// @notice The SelfKisser granting access to Chronicle oracles.
    ISelfKisser public immutable selfKisser;

    constructor(address chronicle_, address selfKisser_) {
        chronicle = IChronicle(chronicle_);
        selfKisser = ISelfKisser(selfKisser_);

        // Note to add address(this) to chronicle oracle's whitelist.
        // This allows the contract to read from the chronicle oracle.
        selfKisser.selfKiss(address(chronicle));
    }

    /// @notice Function to read the latest data from the Chronicle oracle.
    /// @return val The current value returned by the oracle.
    function read() external view returns (uint256 val) {
        return chronicle.read();
    }
}

// Copied from [chronicle-std](https://github.com/chronicleprotocol/chronicle-std/blob/main/src/IChronicle.sol).
interface IChronicle {
    function read() external view returns (uint256 value);
}

// Copied from [self-kisser](https://github.com/chronicleprotocol/self-kisser/blob/main/src/ISelfKisser.sol).
interface ISelfKisser {
    /// @notice Kisses caller on oracle `oracle`.
    function selfKiss(address oracle) external;
}
