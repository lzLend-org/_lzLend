// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./DstPool.sol";

contract PoolDstFactory {
    mapping(address => address[]) public ownerToDstPools;

    address[] public allDstPools;

    event DeployedDstPool(address dstPoolAddress);

    function deployDstPool(
        address _endpoint,
        address _delegate,
        address _collateralToken,
        uint32 _dstChainId
    ) external {
        DstPool pool = new DstPool(
            _endpoint,
            _delegate,
            _collateralToken,
            _dstChainId
        );
        ownerToDstPools[msg.sender].push(address(pool));
        allDstPools.push(address(pool));
        emit DeployedDstPool(address(pool));
    }

    /* ========== GETTERS ========== */

    function getDstPoolsByOwner(
        address _owner
    ) external view returns (address[] memory) {
        return ownerToDstPools[_owner];
    }

    function getAllDstPools() external view returns (address[] memory) {
        return allDstPools;
    }
}
