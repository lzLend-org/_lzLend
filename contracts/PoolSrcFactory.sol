// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./SrcPool.sol";

contract PoolSrcFactory {
    mapping(address => address[]) private ownerToSrcPools;

    address[] private allSrcPools;

    event DeployedSrcPool(address srcPoolAddress);

    function deploySrcPool(
        address _endpoint,
        address _delegate,
        uint32 _dstChainId,
        address _dstPoolAddress,
        address _poolToken,
        address _oracleAddress,
        uint256[] memory _oraclePricesIndex,
        address _collateralToken,
        uint256 _ltv,
        uint256 _apr,
        uint256 _expiry
    ) external {
        SrcPool pool = new SrcPool(
            _endpoint,
            _delegate,
            _dstChainId,
            _dstPoolAddress,
            _poolToken,
            _oracleAddress,
            _oraclePricesIndex,
            _collateralToken,
            _ltv,
            _apr,
            _expiry
        );
        ownerToSrcPools[msg.sender].push(address(pool));
        allSrcPools.push(address(pool));
        emit DeployedSrcPool(address(pool));
    }

    /* ========== GETTERS ========== */

    function getSrcPoolsByOwner(address _owner) external view returns (address[] memory) {
        return ownerToSrcPools[_owner];
    }

    function getAllSrcPools() external view returns (address[] memory) {
        return allSrcPools;
    }
}