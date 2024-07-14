// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./SrcPool.sol";

contract PoolSrcFactory {
    address[] private allSrcPools;
    address[] private listedSrcPools;

    mapping(address => address[]) private ownerToSrcPools;

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

    function listSrcPool(address srcPoolAddress) external {
        require(
            isOwner(msg.sender, srcPoolAddress),
            "Only the owner can list the pool"
        );
        listedSrcPools.push(srcPoolAddress);
    }

    function buySrcPool(address srcPoolAddress) external {
        address oldOwner = getOwner(srcPoolAddress);

        // Transfer the pool ownership
        removeSrcPoolFromOwner(oldOwner, srcPoolAddress);
        ownerToSrcPools[msg.sender].push(srcPoolAddress);

        removeListedPool(srcPoolAddress);
    }

    /* ========== GETTERS ========== */

    function getSrcPoolsByOwner(
        address _owner
    ) external view returns (address[] memory) {
        return ownerToSrcPools[_owner];
    }

    function getAllSrcPools() external view returns (address[] memory) {
        return allSrcPools;
    }

    function getListedSrcPools() external view returns (address[] memory) {
        return listedSrcPools;
    }

    /* ========== INTERNAL FUNCTIONS ========== */

    function isOwner(
        address owner,
        address srcPoolAddress
    ) internal view returns (bool) {
        address[] memory pools = ownerToSrcPools[owner];
        for (uint256 i = 0; i < pools.length; i++) {
            if (pools[i] == srcPoolAddress) {
                return true;
            }
        }
        return false;
    }

    function getOwner(address srcPoolAddress) internal view returns (address) {
        for (uint256 i = 0; i < allSrcPools.length; i++) {
            if (isOwner(msg.sender, srcPoolAddress)) {
                return msg.sender;
            }
        }
        return address(0);
    }

    function removeSrcPoolFromOwner(
        address owner,
        address srcPoolAddress
    ) internal {
        address[] storage pools = ownerToSrcPools[owner];
        for (uint256 i = 0; i < pools.length; i++) {
            if (pools[i] == srcPoolAddress) {
                pools[i] = pools[pools.length - 1];
                pools.pop();
                break;
            }
        }
    }

    function removeListedPool(address srcPoolAddress) internal {
        for (uint256 i = 0; i < listedSrcPools.length; i++) {
            if (listedSrcPools[i] == srcPoolAddress) {
                listedSrcPools[i] = listedSrcPools[listedSrcPools.length - 1];
                listedSrcPools.pop();
                break;
            }
        }
    }
}
