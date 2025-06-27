"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = void 0;
const ethers_1 = require("ethers");
const provider = new ethers_1.ethers.JsonRpcProvider("https://rpc.coredao.org");
const abi = [
    "function createRewardReceiver(uint rewardPortionForBTC) external",
    "event CreateRewardReceiver(address indexed from, address indexed order, uint256 rewardPortionForBTC, uint256 time)",
];
const CREATE_REWARD_RECEIVER_SIGNATURE = "0xd2b1d5b132f5d4708209ccf5c5901620429f83988ea4d678603d1f2d57e2400f";
const createOrder = (rewardPortionForBTC, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    const signer = new ethers_1.Wallet(privateKey, provider);
    const MARKETPLACE_CONTRACT = new ethers_1.Contract("0x04EA61C431F7934d51fEd2aCb2c5F942213f8967", abi, signer);
    let tx;
    try {
        //ts-ignore
        tx = yield MARKETPLACE_CONTRACT.createRewardReceiver(rewardPortionForBTC);
    }
    catch (e) {
        throw new Error(`Fail to create order,error ${e}, please check and try again`);
    }
    let txReceipt = yield (tx === null || tx === void 0 ? void 0 : tx.wait());
    if (txReceipt === null)
        throw new Error("Error in create new order, please check and try again");
    let createRewardReceiverEvents = txReceipt.logs.filter(el => el.topics[0] === CREATE_REWARD_RECEIVER_SIGNATURE);
    if (createRewardReceiverEvents.length !== 1) {
        throw new Error(`Something went wrong with get order event,${createRewardReceiverEvents.length} events found, please check and try again`);
    }
    let createRewardReceiverLog = MARKETPLACE_CONTRACT.interface.parseLog(createRewardReceiverEvents[0]);
    if (createRewardReceiverLog === null || createRewardReceiverLog.name !== "CreateRewardReceiver") {
        throw new Error(`Fail to parse event log, please check and try again`);
    }
    console.log("Order address:", createRewardReceiverLog.args[1]);
    return createRewardReceiverLog.args[1];
});
exports.createOrder = createOrder;
