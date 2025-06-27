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
exports.createFairShareOrder = void 0;
const ethers_1 = require("ethers");
const provider = new ethers_1.ethers.JsonRpcProvider("https://rpc.coredao.org");
const abi = [
    "function createRewardReceiver() external",
    "event CreateRewardReceiver(address indexed from, address indexed order)",
];
const CREATE_REWARD_RECEIVER_SIGNATURE = "0x9fc6fb9907d1273365fd350a7600a902a5d78a095ff29f2d700ea53afc9382e8";
const createFairShareOrder = (privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    const signer = new ethers_1.Wallet(privateKey, provider);
    const FAIR_SHARE_BTC_CONTRACT = new ethers_1.Contract("0x13E3eC65EFeB0A4583c852F4FaF6b2Fb31Ff04b1", abi, signer);
    let tx;
    try {
        //ts-ignore
        tx = yield FAIR_SHARE_BTC_CONTRACT.createRewardReceiver();
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
    let createRewardReceiverLog = FAIR_SHARE_BTC_CONTRACT.interface.parseLog(createRewardReceiverEvents[0]);
    if (createRewardReceiverLog === null || createRewardReceiverLog.name !== "CreateRewardReceiver") {
        throw new Error(`Fail to parse event log, please check and try again`);
    }
    console.log("Order address:", createRewardReceiverLog.args[1]);
    return createRewardReceiverLog.args[1];
});
exports.createFairShareOrder = createFairShareOrder;
