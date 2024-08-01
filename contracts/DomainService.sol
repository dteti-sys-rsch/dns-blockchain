// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

contract DomainService {
  struct DomainStruct {
    address owner;
    string domainName;
    string A;
    string CNAME;
    string NS;
    string MX;
    // string TXT;
    // string SOA;
    bool exists;
  }

  event DomainCreated(address owner, string domainName, string A, string CNAME, string NS, string MX);

  mapping (string => DomainStruct) public domains;

  DomainStruct[] public domain;

  function createDomain (address owner, string memory _domainName, string memory _A, string memory _CNAME, string memory _NS, string memory _MX) public {
    require(domains[_domainName].exists == false, "Domain already exists");

    domain.push(DomainStruct(owner, _domainName, _A, _CNAME, _NS, _MX, true));

    emit DomainCreated(owner, _domainName, _A, _CNAME, _NS, _MX);
  }

  function dnsLookup (string memory _domainName) public view returns (DomainStruct[] memory) {
    require(domains[_domainName].exists == true, "Domain does not exist");

    return domain;
  }

}