import { task } from "hardhat/config";
import { Options } from "@layerzerolabs/lz-v2-utilities";

task(
  "deployOracles",
  "📰 Deploys a contract, saves the artifact and verifies it."
).setAction(async (args, { viem, network, run }) => {
  const owner = (await viem.getWalletClients())[0].account.address;
  const OracleContract = await viem.deployContract("Oracle", [
    "0x6EDCE65403992e310A62460808c4b910D972f10f", // endpoint sepolia testnet
    owner,
  ]);

  const FlareContract = await viem.deployContract("FlareOracle", [
    "0x6EDCE65403992e310A62460808c4b910D972f10f", // endpoint flare testnet
    owner,
    [40161], // sepolia endpoint id
  ]);

  const padOracleContract = '0x'.concat(OracleContract.address.slice(2).padStart(64, '0')) as `0x${string}`
  const padFlareContract = '0x'.concat(FlareContract.address.slice(2).padStart(64, '0')) as `0x${string}`

  await FlareContract.write.setPeer([40161, padOracleContract]);
  await OracleContract.write.setPeer([40161, padFlareContract]);

  console.log(
    `📰 OracleContract ${OracleContract.address} deployed to ${network.name} successfully!`
  );

  const options = Options.newOptions()
    .addExecutorLzReceiveOption(65000, 0)
    .toHex();
  console.log(options);
});

// 0x0000000000000000000000002511aac2823d68351a2e8e7c28200a095becf276
