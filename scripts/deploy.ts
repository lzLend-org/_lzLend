import { task } from "hardhat/config"
import { save } from "./utils/save"
import { verify } from "./utils/verify"

task("deploy", "📰 Deploys a contract, saves the artifact and verifies it.")
    .addParam("contract", "Name of the contract to deploy.", "ChronicleOracle")
    .addFlag("save", "Flag to indicate whether to save the contract or not")
    .addFlag("verify", "Flag to indicate whether to verify the contract or not")
    .setAction(async (args, { viem, network, run }) => {
        const Contract = await viem.deployContract(args.contract, [
            [
                "0x6edF073c4Bd934d3916AA6dDAC4255ccB2b7c0f0",
                "0xdd6D76262Fd7BdDe428dcfCd94386EbAe0151603",
            ],
            "0x0Dcc19657007713483A5cA76e6A7bbe5f56EA37d",
        ])

        console.log(
            `📰 Contract ${Contract.address} deployed to ${network.name} successfully!`
        )

        const chainId = (await viem.getPublicClient()).chain.id

        args.save && (await save(chainId, Contract.address, Contract.abi))
        args.verify && (await verify(run, Contract.address, []))
    })
