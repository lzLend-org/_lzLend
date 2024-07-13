// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPoolFactory {
    event DeployedSrcPool(address srcPoolAddress);
    event DeployedDstPool(address dstPoolAddress);

    function deploySrcPool(
        address _endpoint,
        address _delegate,
        uint32 _dstChainId,
        address _dstPoolAddress,
        address _poolToken,
        address _collateralToken,
        uint256 _ltv,
        uint256 _apr,
        uint256 _expiry
    ) external;

    function deployDstPool(
        address _endpoint,
        address _delegate,
        address _collateralToken,
        uint32 _dstChainId
    ) external;

    function getSrcPoolsByOwner(
        address _owner
    ) external view returns (address[] memory);

    function getDstPoolsByOwner(
        address _owner
    ) external view returns (address[] memory);

    function getAllSrcPools() external view returns (address[] memory);

    function getAllDstPools() external view returns (address[] memory);
}
