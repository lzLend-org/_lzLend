import { task } from "hardhat/config";

const padBytes32 = (address: string) =>
  "0x".concat(address.slice(2).padStart(64, "0")) as `0x${string}`;

task("peers", "🔗 Sets the peers and connects the different chains")
  .addParam("contract", "Name of the contract to interact peer with.")
  .addParam("address", "The address of the contract")
  .addParam("dsteid", "Destination endpoint id")
  .addParam("dstaddress", "The address of the destination contract")

  .setAction(async (args, { viem }) => {
    const contract = await viem.getContractAt(args.contract, args.address);
    // Endpoint ID, contract address on the other chain
    const tx = await (contract.write as any).setPeer([
      args.dsteid,
      padBytes32(args.dstaddress),
    ]);
    console.log(tx);
  });
