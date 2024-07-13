// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IOracle {
    function getPrice(uint256 index) external view returns (uint256);

    function pythPrices(uint256 index) external view returns (uint256);

    function flarePrices(uint256 index) external view returns (uint256);

    function chroniclePrices(uint256 index) external view returns (uint256);
}
