// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

contract DomainService {
    struct DomainStruct {
        address owner;
        string domainName;
        string ARecord;
        bool exist;
    }

    event DomainCreated(
        address owner, 
        string domainName, 
        string ARecord,
        bool exist
    );

    event DomainUpdated(
        address owner, 
        string domainName, 
        string ARecord,
        bool exist
    );

    event DomainDeleted(
        address owner, 
        string domainName
    );

    mapping(string => DomainStruct) public domains;
    string[] public domainList;

    modifier notExist(string memory domainName) {
        require(keccak256(abi.encodePacked(domains[domainName].domainName)) != keccak256(abi.encodePacked(domainName)), 
            "Domain sudah ada");
        _;
    }

    modifier isExist(string memory domainName) {
        require(keccak256(abi.encodePacked(domains[domainName].domainName)) == keccak256(abi.encodePacked(domainName)), 
            "Domain tidak ada");
        _;
    }

    modifier onlyOwner(string memory domainName) {
        require(domains[domainName].owner == msg.sender, 
            "Domain not owned by sender");
        _;
    }

    function createDomain(
        address owner, 
        string memory domainName, 
        string memory ARecord
    ) 
        public 
        notExist(domainName) 
        returns (bool) 
    {
        DomainStruct memory new_domain = DomainStruct(owner, domainName, ARecord, true);
        domains[domainName] = new_domain;
        domainList.push(domainName);

        emit DomainCreated(owner, domainName, ARecord, true);
        return true;
    }

    function domainLookup(
        string memory domainName
    ) 
        public 
        view 
        isExist(domainName) 
        returns (string memory) 
    {
        return domains[domainName].ARecord;
    }

    function updateDomain(
        address owner, 
        string memory domainName, 
        string memory ARecord
    ) 
        public 
        onlyOwner(domainName) 
        isExist(domainName) 
        returns (bool) 
    {
        DomainStruct memory updated_domain = DomainStruct(owner, domainName, ARecord, true);
        domains[domainName] = updated_domain;

        emit DomainUpdated(owner, domainName, ARecord, true);
        return true;
    }

    function deleteDomain(
        address owner, 
        string memory domainName
    ) 
        public 
        onlyOwner(domainName) 
        isExist(domainName) 
        returns (bool) 
    {
        delete domains[domainName];

        for (uint i = 0; i < domainList.length; i++) {
            if (keccak256(abi.encodePacked(domainList[i])) == keccak256(abi.encodePacked(domainName))) {
                domainList[i] = domainList[domainList.length - 1];
                domainList.pop();
                break;
            }
        }

        emit DomainDeleted(owner, domainName);
        return true;
    }

    function getAllDomainsByOwner(
        address owner
    ) 
        public 
        view 
        returns (DomainStruct[] memory) 
    {
        uint ownerDomainCount = 0;

        for (uint i = 0; i < domainList.length; i++) {
            if (domains[domainList[i]].owner == owner) {
                ownerDomainCount++;
            }
        }

        DomainStruct[] memory ownerDomains = new DomainStruct[](ownerDomainCount);
        uint currentIndex = 0;

        for (uint i = 0; i < domainList.length; i++) {
            if (domains[domainList[i]].owner == owner) {
                ownerDomains[currentIndex] = domains[domainList[i]];
                currentIndex++;
            }
        }

        return ownerDomains;
    }

}
