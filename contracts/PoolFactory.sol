// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.24;

// import "./DstPool.sol";
// import "./SrcPool.sol";

// contract PoolFactory {
//     mapping(address => address[]) private ownerToSrcPools;
//     mapping(address => address[]) private ownerToDstPools;

//     address[] private allSrcPools;
//     address[] private allDstPools;

//     event DeployedSrcPool(address srcPoolAddress);
//     event DeployedDstPool(address dstPoolAddress);

//     function deploySrcPool(
//         address _endpoint,
//         address _delegate,
//         uint32 _dstChainId,
//         address _dstPoolAddress,
//         address _poolToken,
//         address _oracleAddress,
//         uint256[] memory _oraclePricesIndex,
//         address _collateralToken,
//         uint256 _ltv,
//         uint256 _apr,
//         uint256 _expiry
//     ) external {
//         SrcPool pool = new SrcPool(
//             _endpoint,
//             _delegate,
//             _dstChainId,
//             _dstPoolAddress,
//             _poolToken,
//             _oracleAddress,
//             _oraclePricesIndex,
//             _collateralToken,
//             _ltv,
//             _apr,
//             _expiry
//         );
//         ownerToSrcPools[msg.sender].push(address(pool));
//         allSrcPools.push(address(pool));
//         emit DeployedSrcPool(address(pool));
//     }

//     function deployDstPool(
//         address _endpoint,
//         address _delegate,
//         address _collateralToken,
//         uint32 _dstChainId
//     ) external {
//         DstPool pool = new DstPool(
//             _endpoint,
//             _delegate,
//             _collateralToken,
//             _dstChainId
//         );
//         ownerToDstPools[msg.sender].push(address(pool));
//         allDstPools.push(address(pool));
//         emit DeployedDstPool(address(pool));
//     }

//     /* ========== GETTERS ========== */

//     function getSrcPoolsByOwner(address _owner) external view returns (address[] memory) {
//         return ownerToSrcPools[_owner];
//     }

//     function getDstPoolsByOwner(address _owner) external view returns (address[] memory) {
//         return ownerToDstPools[_owner];
//     }

//     function getAllSrcPools() external view returns (address[] memory) {
//         return allSrcPools;
//     }

//     function getAllDstPools() external view returns (address[] memory) {
//         return allDstPools;
//     }
// }