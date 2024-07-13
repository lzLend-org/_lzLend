import { task } from "hardhat/config"
import { save } from "./utils/save"
import { verify } from "./utils/verify"

task("deploy", "📰 Deploys a contract, saves the artifact and verifies it.")
    .addParam("contract", "Name of the contract to deploy.", "FlareOracle")
    .addFlag("save", "Flag to indicate whether to save the contract or not")
    .addFlag("verify", "Flag to indicate whether to verify the contract or not")
    .setAction(async (args, { viem, network, run }) => {
        const walletClient = await viem.getWalletClients();
        const Contract = await viem.deployContract(args.contract, [
            '0x6EDCE65403992e310A62460808c4b910D972f10f', // endpoint flare testnet
            walletClient[0].account.address,
            [40161], // sepolia endpoint id
        ])

        console.log(
            `📰 Contract ${Contract.address} deployed to ${network.name} successfully!`
        )

        const chainId = (await viem.getPublicClient()).chain.id

        args.save && (await save(chainId, Contract.address, Contract.abi))
        args.verify && (await verify(run, Contract.address, []))
    })
