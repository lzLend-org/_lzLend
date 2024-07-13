import { task } from "hardhat/config";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { formatEther } from "viem";

task(
  "interact",
  "📰 Deploys a contract, saves the artifact and verifies it."
).setAction(async (args, { viem, network, run }) => {
  const Contract = await viem.getContractAt(
    "FlareOracle",
    "0x2511aac2823d68351a2e8e7c28200a095becf276"
  );

  const options = Options.newOptions()
    .addExecutorLzReceiveOption(65000, 0)
    .toHex() as `0x${string}`;

  const prices = await Contract.read.read();
  console.log(`Prices on Flare: ${prices}`);

  const quote = await Contract.read.quote(["0x", options, false]);
  console.log(
    `Native Fee from Flare -> Sepolia: ${formatEther(quote.nativeFee)}`
  );

  // const send = await Contract.write.readAndSend([options], {
  //   value: BigInt(100 * 10**18),
  // });
  // console.log(`Transaction Hash: ${send}`);
});
