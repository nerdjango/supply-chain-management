//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract SupplyChain {
    struct Item {
        string id;
        string name;
        address owner;
        string location;
        string status;
    }
    mapping(string => Item) public items;
    address public owner;

    event ItemCreated(string indexed id);
    event ItemTransferred(string indexed id, address from, address to);
    event ItemUpdated(
        string indexed id,
        string indexed location,
        string indexed status
    );

    constructor() {
        owner = msg.sender;
    }

    function createItem(string memory _id, string memory _name) external {
        require(msg.sender == owner, "not owner");
        items[_id] = Item(_id, _name, msg.sender, "", "");
        emit ItemCreated(_id);
    }

    function transferItem(string memory _id, address _to) external {
        require(msg.sender == items[_id].owner, "not holder");
        items[_id].owner = _to;
        emit ItemTransferred(_id, msg.sender, _to);
    }

    function updateItem(
        string memory _id,
        string memory _location,
        string memory _status
    ) external {
        require(msg.sender == items[_id].owner, "not holder");
        items[_id].location = _location;
        items[_id].status = _status;
        emit ItemUpdated(_id, _location, _status);
    }
}
