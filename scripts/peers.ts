
import { task } from "hardhat/config";

task("peers", "🔗 Sets the peers and connects the different chains")
  .addParam("contract", "Name of the contract to interact peer with.")
  .addParam("address", "The address of the contract")
  .addFlag("verify", "Flag to indicate whether to verify the contract or not")
  .setAction(async (args, { viem, network, run }) => {
    const contract = await viem.getContractAt(args.contract, args.address)
    // Endpoint ID, contract address on the other chain
    const tx = await contract.write.setPeer([40323, '0x...'])
    console.log(tx)
  });
