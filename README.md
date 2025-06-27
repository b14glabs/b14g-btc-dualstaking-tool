# Readme

This repository contains TypeScript/JavaScript samples to compose the `create` order (Merge Order and Fair-Share Order) in b14g Marketplace and `redeem` transactions on Bitcoin network. The targeted readers should have knowledge on Bitcoin transaction formats and are familiar with TS/JS programming languages.

Quick link to technical design (draft version): https://famous-exoplanet-701.notion.site/BTC-Staking-Transaction-Design-v2-bfa311f7f19e45688a944fb9c1e32c59. 

For those who want a more user friendly interface, please test it out on https://app.b14g.xyz.

## How to

### Run the script directly

If you want to use the tool directly, please run `npm install` and scripts below. For more information about the parameters, please check the [index](index.ts) file.

`Create Merge Order`

``` shell
node dist/index.js stake --account tb1qzdvhlak7y8kz0v5hu2tw7qae3969jzrt7rj7n5 --privatekey {btcprivatekey} --btcStakingType 1 --amount 1000000 --bitcoinnetwork 1 --corenetwork 1 --locktime 1712847585  --validatoraddress  0x3aE030Dc3717C66f63D6e8f1d1508a5C941ff46D --coreprivatekey {corePrivateKey} --rewardportion  50000000
```

If successful, you will see the console returns order address, transaction id, the locked P2SH/P2WSH script address and the redeem script, which will be used on the following redeem transaction. Please save them properly. 

Example

``` shell
Order address: 
txId: 
address: 
redeemScript: 
```

`Create Fair Share Order`

``` shell
node dist/index.js stake --account tb1qzdvhlak7y8kz0v5hu2tw7qae3969jzrt7rj7n5 --privatekey {btcprivatekey} --btcStakingType 2 --amount 1000000 --bitcoinnetwork 1 --corenetwork 1 --locktime 1712847585  --validatoraddress  0x3aE030Dc3717C66f63D6e8f1d1508a5C941ff46D --coreprivatekey {corePrivateKey} --rewardportion  50000000
```

If successful, you will see the console returns order address, transaction id, the locked P2SH/P2WSH script address and the redeem script, which will be used on the following redeem transaction. Please save them properly.

Example

``` shell
Order address: 
txId: 
address: 
redeemScript: 
```



`redeem BTC`
```shell
node dist/index.js redeem --account 2N7LJiG1ZGk97jUuhDcsRquPjgxFjT273fi --redeemscript 04e1fa1766b17576a91413597ff6de21ec27b297e296ef03b9897459086b88ac --privatekey ${private key} --destaddress tb1qzdvhlak7y8kz0v5hu2tw7qae3969jzrt7rj7n5
```

`claim CORE rewards`

Please visit https://app.b14g.xyz/my-portfolio, connect to the site using the address from corePrivateKey and you can see the new orders and claim rewards once system distributes in each round.

## Disclaimer
### Warning: This software is provided as-is for educational and testing purposes only. It is not intended for use in production environments. By using this software, you agree to assume all risks associated with its use. The authors, contributors, and maintainers are not responsible for any damage, data loss, or legal liability that may result from the use or misuse of this software.

### Use at Your Own Risk: This repository may contain bugs, security vulnerabilities, or incomplete features that could impact stability, security, or performance. Users are advised to thoroughly test and review the software in a safe, controlled environment before considering its application elsewhere. Production-grade implementation is strongly discouraged unless explicitly stated otherwise.
