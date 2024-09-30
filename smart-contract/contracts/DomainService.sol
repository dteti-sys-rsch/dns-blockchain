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
    string[] public domainList; // Menyimpan daftar nama domain

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

    modifier onlyOwner(string memory domainName, address owner) {
        require(domains[domainName].owner == owner, "Domain not owned by sender");
        _;
    }

    // Fungsi untuk membuat domain baru
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
        domainList.push(domainName); // Menambahkan domain ke daftar

        emit DomainCreated(owner, domainName, ARecord, true);
        return true;
    }

    // Fungsi untuk melihat ARecord dari domain yang sudah ada
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

    // Fungsi untuk memperbarui informasi domain
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
        DomainStruct memory updated_domain = DomainStruct(owner, domainName, ARecord, true);
        domains[domainName] = updated_domain;

        emit DomainUpdated(owner, domainName, ARecord, true);
        return true;
    }

    // Fungsi untuk menghapus domain
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

        // Hapus domain dari domainList
        for (uint i = 0; i < domainList.length; i++) {
            if (keccak256(abi.encodePacked(domainList[i])) == keccak256(abi.encodePacked(domainName))) {
                // Menghapus elemen dari array domainList dengan menggeser elemen
                domainList[i] = domainList[domainList.length - 1]; // Ganti elemen dengan elemen terakhir
                domainList.pop(); // Hapus elemen terakhir
                break;
            }
        }

        emit DomainDeleted(owner, domainName);
        return true;
    }

    // Fungsi untuk mendapatkan semua domain yang ada
    function getAllDomains() 
        public 
        view 
        returns (DomainStruct[] memory) 
    {
        DomainStruct[] memory allDomains = new DomainStruct[](domainList.length);

        for (uint i = 0; i < domainList.length; i++) {
            allDomains[i] = domains[domainList[i]];
        }

        return allDomains;
    }

}
