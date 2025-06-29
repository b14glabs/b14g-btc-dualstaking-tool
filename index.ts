#!/usr/bin/env node

import * as commander from "commander";
import {stake} from "./src/stake";
import {redeem} from "./src/redeem";
import {createOrder} from "./src/createOrder";
import {BitcoinNetworkMap, CoreNetworkMap, FeeSpeedMap} from "./src/constant";
import {createFairShareOrder} from "./src/createFairShareOrder";

const program = new commander.Command();

program
    .version("1.0.0")
    .description("Core chain self custody BTC staking command line tool.");

program
    .command("stake")
    .description("Stake BTC")

    .requiredOption(
        "-acc, --account <account>",
        "The Bitcon address used to stake."
    )
    .requiredOption(
        "-privkey, --privatekey <privatekey>",
        "The private key used to sign the transaction, which should be associated with --account. Hex format."
    )
    .requiredOption(
        "-amt, --amount <amount>",
        "Amount of BTC to stake, measured in SAT."
    )
    .requiredOption(
        "-bst, --btcStakingType <btcStakingType>",
        "BTC staking strategy type, choose between 1~2. 1) Merge Order 2) Fair Share "
    )

    .option(
        "-bn, --bitcoinnetwork <bitcoinnetwork>",
        "The Bitcoin network to operate on, choose between 1~2. 1)Mainnet 2)Testnet, default to 1)Mainnet."
    )
    .option(
        "-cn, --corenetwork <corenetwork>",
        "The Core network to transmit the stake transaction to, choose between 1~3. 1)Mainnet 2)Devnet 3)Testnet, default to 1)Mainnet."
    )
    .requiredOption(
        "-lt, --locktime <locktime>",
        "The unix timestamp in seconds to lock the BTC assets up to. e.g. 1711983981"
    )
    .option(
        "-pubkey, --publickey <publickey>",
        "The public key used to redeem the BTC assets when locktime expires. Default to the public key associated with --privatekey."
    )
    .requiredOption(
        "-corePriKey, --coreprivatekey <coreprivateKey>",
        "Core private key used to create orders and receive rewards in b14g marketplace"
    )
    .requiredOption(
        "-rePortion, --rewardportion <rewardportion>",
        "Reward sharing percent for BTC stakers (decimal = 6). e.g 50000000 = 50%"
    )
    .requiredOption(
        "-vaddr, --validatoraddress <validatoraddress>",
        "Core validator address to stake to."
    )
    .option("-w, --witness", "Use segwit or not.")
    .option(
        "-br, --bitcoinrpc <bitcoinrpc>",
        "The Bitcoin RPC service to use, default to https://mempool.space/. "
    )
    .option(
        "--fee <fee>",
        "Transaction fee s)slow a)average f)fast, please choose in (s, a ,f) OR a customized number in SAT, default to a)average."
    )
    .action(async (args) => {
        if (args.bitcoinnetwork != 1) {
            throw new Error("We only support BTC mainnet network")
        }
        if (args.corenetwork != 1) {
            throw new Error("We only support Core mainnet network")
        }
        const bitcoinnetwork = BitcoinNetworkMap[args.bitcoinnetwork];
        const corenetwork = CoreNetworkMap[args.corenetwork];
        const fee = FeeSpeedMap[args.fee];
        let rewardAddress
        if (args.btcStakingType == 1) {
            rewardAddress = await createOrder(args.rewardportion, args.coreprivatekey)
        } else {
            rewardAddress = await createFairShareOrder(args.coreprivatekey)
        }
        await stake({
            lockTime: args.locktime,
            amount: args.amount,
            validatorAddress: args.validatoraddress,
            rewardAddress: rewardAddress,
            publicKey: args.publickey,
            account: args.account,
            bitcoinNetwork: bitcoinnetwork,
            coreNetwork: corenetwork,
            privateKey: args.privatekey,
            witness: args.witness,
            bitcoinRpc: args.bitcoinrpc,
            fee: fee || args.fee,
        });
    });

program
    .command("redeem")
    .description("Redeem BTC")
    .requiredOption(
        "-acc, --account <account>",
        "The locked P2SH/P2WSH script address."
    )
    .requiredOption(
        "-r, --redeemscript <redeemscript>",
        "The redeem script which was returned in the stake action."
    )
    .requiredOption(
        "-privkey, --privatekey <privatekey>",
        "The private key associated --publickey in the stake action. Hex format."
    )
    .requiredOption(
        "-d, --destaddress <destaddress>",
        "The Bitcoin address to receive the redeemed BTC assets."
    )
    .option(
        "-br, --bitcoinrpc <bitcoinrpc>",
        "The Bitcoin RPC service to use, default to https://mempool.space/. "
    )
    .option(
        "--fee <fee>",
        "Transaction fee s)slow a)average f)fast, please choose in (s, a ,f) OR a customized number in SAT, default to a)average."
    )
    .action(async (args) => {
        const fee = FeeSpeedMap[args.fee];

        await redeem({
            account: args.account,
            redeemScript: args.redeemscript,
            privateKey: args.privatekey,
            destAddress: args.destaddress,
            bitcoinRpc: args.bitcoinRpc,
            fee: fee || args.fee,
        });
    });

program.parse(process.argv);
