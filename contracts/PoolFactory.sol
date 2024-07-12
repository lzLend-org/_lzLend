// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./DstPool.sol";
import "./SrcPool.sol";

contract PoolFactory {
    mapping(address => address[]) private ownerToSrcPools;
    mapping(address => address[]) private ownerToDstPools;

    function deploySrcPool(
        address _endpoint,
        address _delegate,
        uint32 _dstChainId,
        address _poolToken,
        address _collateralToken,
        uint256 _ltv,
        uint256 _apr,
        uint256 _expiry
    ) external returns (address) {
        SrcPool pool = new SrcPool(
            _endpoint,
            _delegate,
            _dstChainId,
            _poolToken,
            _collateralToken,
            _ltv,
            _apr,
            _expiry
        );
        ownerToSrcPools[msg.sender].push(address(pool));
        return address(pool);
    }

    function deployDstPool(
        address _endpoint,
        address _delegate,
        address _collateralToken,
        uint32 _dstChainId
    ) external returns (address) {
        DstPool pool = new DstPool(
            _endpoint,
            _delegate,
            _collateralToken,
            _dstChainId
        );
        ownerToDstPools[msg.sender].push(address(pool));
        return address(pool);
    }

    /* ========== GETTERS ========== */

    function getSrcPoolsByOwner(address _owner) external view returns (address[] memory) {
        return ownerToSrcPools[_owner];
    }

    function getDstPoolsByOwner(address _owner) external view returns (address[] memory) {
        return ownerToDstPools[_owner];
    }
}