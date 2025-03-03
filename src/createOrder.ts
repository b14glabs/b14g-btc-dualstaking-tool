import {ethers, Contract, Transaction, Signer, JsonRpcSigner, Wallet} from "ethers"

const provider = new ethers.JsonRpcProvider("https://rpc.coredao.org")

const abi = [
    "function createRewardReceiver(uint rewardPortionForBTC) external",
    "event CreateRewardReceiver(address indexed from, address indexed order, uint256 rewardPortionForBTC, uint256 time)",
]
const CREATE_REWARD_RECEIVER_SIGNATURE = "0xd2b1d5b132f5d4708209ccf5c5901620429f83988ea4d678603d1f2d57e2400f"
export const createOrder = async (rewardPortionForBTC: number, privateKey: string) => {
    const signer = new Wallet(privateKey, provider);
    const MARKETPLACE_CONTRACT = new Contract("0x04EA61C431F7934d51fEd2aCb2c5F942213f8967", abi, signer)
    let tx;
    try {
        //ts-ignore
        tx = await MARKETPLACE_CONTRACT.createRewardReceiver(rewardPortionForBTC)
    } catch (e) {
        throw new Error(`Fail to create order,error ${e}, please check and try again`);
    }
    let txReceipt = await tx?.wait()
    if (txReceipt === null) throw new Error("Error in create new order, please check and try again");
    let createRewardReceiverEvents = (txReceipt as ethers.TransactionReceipt).logs.filter(el => el.topics[0] === CREATE_REWARD_RECEIVER_SIGNATURE)
    if (createRewardReceiverEvents.length !== 1) {
        throw new Error(`Something went wrong with get order event,${createRewardReceiverEvents.length} events found, please check and try again`);
    }
    let createRewardReceiverLog = MARKETPLACE_CONTRACT.interface.parseLog(createRewardReceiverEvents[0])
    if (createRewardReceiverLog === null || createRewardReceiverLog.name !== "CreateRewardReceiver") {
        throw new Error(`Fail to parse event log, please check and try again`);

    }
    console.log("Order address:", createRewardReceiverLog.args[1])
    return createRewardReceiverLog.args[1]
}
