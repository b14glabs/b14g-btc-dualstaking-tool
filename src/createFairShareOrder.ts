import {ethers, Contract, Transaction, Signer, JsonRpcSigner, Wallet} from "ethers"

const provider = new ethers.JsonRpcProvider("https://rpc.coredao.org")

const abi = [
    "function createRewardReceiver() external",
    "event CreateRewardReceiver(address indexed from, address indexed order)",
]
const CREATE_REWARD_RECEIVER_SIGNATURE = "0x9fc6fb9907d1273365fd350a7600a902a5d78a095ff29f2d700ea53afc9382e8"
export const createFairShareOrder = async (privateKey: string) => {
    const signer = new Wallet(privateKey, provider);
    const FAIR_SHARE_BTC_CONTRACT = new Contract("0x13E3eC65EFeB0A4583c852F4FaF6b2Fb31Ff04b1", abi, signer)
    let tx;
    try {
        //ts-ignore
        tx = await FAIR_SHARE_BTC_CONTRACT.createRewardReceiver()
    } catch (e) {
        throw new Error(`Fail to create order,error ${e}, please check and try again`);
    }
    let txReceipt = await tx?.wait()
    if (txReceipt === null) throw new Error("Error in create new order, please check and try again");
    let createRewardReceiverEvents = (txReceipt as ethers.TransactionReceipt).logs.filter(el => el.topics[0] === CREATE_REWARD_RECEIVER_SIGNATURE)
    if (createRewardReceiverEvents.length !== 1) {
        throw new Error(`Something went wrong with get order event,${createRewardReceiverEvents.length} events found, please check and try again`);
    }
    let createRewardReceiverLog = FAIR_SHARE_BTC_CONTRACT.interface.parseLog(createRewardReceiverEvents[0])
    if (createRewardReceiverLog === null || createRewardReceiverLog.name !== "CreateRewardReceiver") {
        throw new Error(`Fail to parse event log, please check and try again`);

    }
    console.log("Order address:", createRewardReceiverLog.args[1])
    return createRewardReceiverLog.args[1]
}
