const main = async () => {
  const Deployer = await hre.ethers.getContractFactory("DomainService");
  const DomainService = await Deployer.deploy();

  console.log("DNS deploy address: ", await DomainService.getAddress());
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});