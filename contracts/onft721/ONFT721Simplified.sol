// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title ONFT721 Contract
 * @dev ONFT721 is an ERC-721 token that extends the functionality of the ONFT721Core contract.
 */
abstract contract ONFT721 is ERC721 {
    /**
     * @dev Constructor for the ONFT721 contract.
     * @param _name The name of the ONFT.
     * @param _symbol The symbol of the ONFT.
     * @param _lzEndpoint The LayerZero endpoint address.
     * @param _delegate The delegate capable of making OApp configurations inside of the endpoint.
     */
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate
    ) ERC721(_name, _symbol) {}
}
