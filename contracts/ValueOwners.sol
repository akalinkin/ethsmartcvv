pragma solidity ^0.4.4;

/// @title ValueOwners contract
/// @author alex@kalinkin.info
// Gets payment from sender only one time with value setted by
// ContractOwner (owner can change cost)
contract ValueOwners is mortal {
    // Owners Payments
    // Holds payment for each owner
    mapping (address => uint) ownersPayments;

    // Cost of life access to the ContractHolded value
    // Can be changed by ContractOwner
    uint public cost;

    // modifier will be executed before modifier-marked-function body
    // if the condition result equals TRUE control will be passed to
    // function body
    // else Exception
    modifier isContractOwner() {
        if (msg.sender != owner) throw;
        _
    }

    // Ctor
    function ValueOwners() {
        // Set up initial Cost value
        cost = 10 finney;
    }

    // Fallback function
    function () { throw; }

    // Set new ValueCost in Wei
    // Only ContractOwner can change Cost
    /// @param value Amount of Ether to be set as ValueCost
    /// @return True if new value of Cost
    function setCost(uint value) public isContractOwner() returns(uint result) {
        cost = value;
        return cost;
    }

    // Returns balance of defined account address
    /// @param account Address of account
    /// @return balance Value payed from defined address
    function getBalance(address account) public isContractOwner() returns (uint balance) {
        return ownersPayments[account];
    }

    // Check is the amount of transaction anouth to pay for Value (equals Cost)
    // Put sender address and sended amount to ownersPayments
    // Gets some secret from external WEB API (generated by backend) and returns it
    function buyValue() {
        // check is there payment from user in contract
        // every user get lifetime access to treasure value
        if (ownersPayments[msg.sender] == 0x0)
            return;
        // chech that user send enouth value (by current cost)
        if (msg.value == cost) {
            ownersPayments[msg.sender] = msg.value;
        }
    }

    // Returns value OR some access code to get it (unpack or decript package with value in it)
    function getValue() {
        // TODO: Implement it
    }
}
