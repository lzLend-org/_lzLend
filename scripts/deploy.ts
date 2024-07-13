import { task } from "hardhat/config";
import fs from "fs";
import path from "path";

const deployedAddressesPath = path.join(__dirname, "deployedaddresses.json");

function updateDeployedAddresses(
  contractName: string,
  contractAddress: string,
  networkName: string
) {
  let deployedAddresses = {};

  if (fs.existsSync(deployedAddressesPath)) {
    deployedAddresses = JSON.parse(
      fs.readFileSync(deployedAddressesPath, "utf8")
    );
  }

  (deployedAddresses as any)[`${contractName}:${networkName}`] =
    contractAddress;
  fs.writeFileSync(
    deployedAddressesPath,
    JSON.stringify(deployedAddresses, null, 2)
  );
}

task(
  "deploy:custom",
  "📰 Deploys a contract based on a contract name and params."
)
  .addParam("contract", "Name of the contract to deploy.")
  .addParam("params", "The parameters of the deployment.")
  .setAction(async (args, { viem, network }) => {
    const contract = await viem.deployContract(
      args.contract,
      JSON.parse(args.params)
    );

    console.log(
      `📰 Contract ${args.contract}:${contract.address} deployed to ${network.name} successfully!`
    );

    updateDeployedAddresses(args.contract, contract.address, network.name);
  });
