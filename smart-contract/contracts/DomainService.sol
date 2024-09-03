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
        string ARecord
    );

    event DomainDeleted(
        string domainName
    );

    mapping(string => DomainStruct) public domains;

    modifier notExist (string memory domainName) {
      require(domains[domainName].exist == false, "Domain sudah ada");
      _;
    }

    modifier isExist (string memory domainName) {
      require(domains[domainName].exist == true, "Domain tidak ada");
      _;
    }

    modifier onlyOwner (string memory domainName, address owner) {
      require(domains[domainName].owner == owner, "Domain not owned by sender");
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
        onlyOwner(domainName, owner) 
        isExist(domainName) 
        returns (bool) 
    {
        DomainStruct memory new_domain = DomainStruct(owner, domainName, ARecord, true);
        domains[domainName] = new_domain;

        emit DomainUpdated(ARecord);
        return true;
    }

    function deleteDomain(
        address owner, 
        string memory domainName
    ) 
        public 
        onlyOwner(domainName, owner) 
        isExist(domainName) 
        returns (bool) 
    {
        delete domains[domainName];
        
        emit DomainDeleted(domainName);
        return true;
    }
}