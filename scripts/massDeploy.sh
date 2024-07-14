#!/bin/bash

# Deploy the tokens
# hh deploy:custom --contract Token --params '["Wrapped Bitcoin", "WBTC"]' --network arbitrum_sepolia
# hh deploy:custom --contract Token --params '["Wrapped Bitcoin", "WBTC"]' --network zircuit_sepolia
# hh deploy:custom --contract Token --params '["Wrapped Bitcoin", "WBTC"]' --network base_sepolia
# hh deploy:custom --contract Token --params '["Wrapped Bitcoin", "WBTC"]' --network scroll_sepolia
# hh deploy:custom --contract Token --params '["Wrapped Bitcoin", "WBTC"]' --network morph

# hh deploy:custom --contract Token --params '["Wrapped Ethereum", "WETH"]' --network arbitrum_sepolia
# hh deploy:custom --contract Token --params '["Wrapped Ethereum", "WETH"]' --network zircuit_sepolia
# hh deploy:custom --contract Token --params '["Wrapped Ethereum", "WETH"]' --network base_sepolia
# hh deploy:custom --contract Token --params '["Wrapped Ethereum", "WETH"]' --network scroll_sepolia
# hh deploy:custom --contract Token --params '["Wrapped Ethereum", "WETH"]' --network morph

# hh deploy:custom --contract Token --params '["USD Coin", "USDC"]' --network arbitrum_sepolia
# hh deploy:custom --contract Token --params '["USD Coin", "USDC"]' --network zircuit_sepolia
# hh deploy:custom --contract Token --params '["USD Coin", "USDC"]' --network base_sepolia
# hh deploy:custom --contract Token --params '["USD Coin", "USDC"]' --network scroll_sepolia
# hh deploy:custom --contract Token --params '["USD Coin", "USDC"]' --network morph

# Deploy the individual oracles
# hh deploy:custom --contract ChronicleOracle --params '["0x6EDCE65403992e310A62460808c4b910D972f10f", "0xCf12de817eb7b858E15175f42483997DD0Ac9bd5", ["40245", "40170", "40290", "40275", "40231"], ["0x4B5aBFC0Fe78233b97C80b8410681765ED9fC29c", "0xc8A1F9461115EF3C1E84Da6515A88Ea49CA97660", "0x1173da1811a311234e7Ab0A33B4B7B646Ff42aEC"], "0x0Dcc19657007713483A5cA76e6A7bbe5f56EA37d"]' --network scroll_sepolia
# hh deploy:custom --contract FlareOracle --params '["0x6EDCE65403992e310A62460808c4b910D972f10f", "0xCf12de817eb7b858E15175f42483997DD0Ac9bd5", ["40245", "40170", "40290", "40275", "40231"]]' --network coston2
# hh deploy:custom --contract PythOracle --params '["0x6EDCE65403992e310A62460808c4b910D972f10f", "0xCf12de817eb7b858E15175f42483997DD0Ac9bd5", ["40245", "40170", "40290", "40275", "40231"], "0x23f0e8FAeE7bbb405E7A7C3d60138FCfd43d7509", ["0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a"]]' --network fuji

# Deploy the master oracle 
# hh deploy:custom --contract Oracle --params '["0x6EDCE65403992e310A62460808c4b910D972f10f", "0xCf12de817eb7b858E15175f42483997DD0Ac9bd5"]' --network zircuit_sepolia
# hh deploy:custom --contract Oracle --params '["0x6EDCE65403992e310A62460808c4b910D972f10f", "0xCf12de817eb7b858E15175f42483997DD0Ac9bd5"]' --network arbitrum_sepolia
# hh deploy:custom --contract Oracle --params '["0x6EDCE65403992e310A62460808c4b910D972f10f", "0xCf12de817eb7b858E15175f42483997DD0Ac9bd5"]' --network base_sepolia
# hh deploy:custom --contract Oracle --params '["0x6EDCE65403992e310A62460808c4b910D972f10f", "0xCf12de817eb7b858E15175f42483997DD0Ac9bd5"]' --network scroll_sepolia
# hh deploy:custom --contract Oracle --params '["0x6EDCE65403992e310A62460808c4b910D972f10f", "0xCf12de817eb7b858E15175f42483997DD0Ac9bd5"]' --network morph

# deploy the pool factory
hh deploy:custom --contract PoolSrcFactory --params '[]' --network zircuit_sepolia
hh deploy:custom --contract PoolDstFactory --params '[]' --network zircuit_sepolia
hh deploy:custom --contract PoolSrcFactory --params '[]' --network arbitrum_sepolia
hh deploy:custom --contract PoolDstFactory --params '[]' --network arbitrum_sepolia
hh deploy:custom --contract PoolSrcFactory --params '[]' --network base_sepolia
hh deploy:custom --contract PoolDstFactory --params '[]' --network base_sepolia
hh deploy:custom --contract PoolSrcFactory --params '[]' --network scroll_sepolia

hh deploy:custom --contract PoolDstFactory --params '[]' --network scroll_sepolia

hh deploy:custom --contract PoolSrcFactory --params '[]' --network morph
hh deploy:custom --contract PoolDstFactory --params '[]' --network morph

# setPeer to the different apps
# # chronicle -> oracle (A)
# # chronicle -> oracle (b)
# ....

# ["40245", "40170", "40290", "40275", "40231"]

# hh peers --contract ChronicleOracle --address "0xecd07d9801e4dd8c87d5f2443cd27b5cf0317f69" --dsteid 40245 --dstaddress "0x617d0f12771e2c04b95a39dd658d74287f170bcd" --network scroll_sepolia
# hh peers --contract ChronicleOracle --address "0xecd07d9801e4dd8c87d5f2443cd27b5cf0317f69" --dsteid 40170 --dstaddress "0xcd9a7e6561a7e08c53244161a5b0669ee4eff58e" --network scroll_sepolia
# hh peers --contract ChronicleOracle --address "0xecd07d9801e4dd8c87d5f2443cd27b5cf0317f69" --dsteid 40290 --dstaddress "" --network scroll_sepolia
# hh peers --contract ChronicleOracle --address "0xecd07d9801e4dd8c87d5f2443cd27b5cf0317f69" --dsteid 40275 --dstaddress "0x0a0276e831180d44c97481cd6a2e0ebc3704cc6e" --network scroll_sepolia
# hh peers --contract ChronicleOracle --address "0xecd07d9801e4dd8c87d5f2443cd27b5cf0317f69" --dsteid 40231 --dstaddress "0xb2f6c64ab2d7c9f39ceaed5648a879cd7d9f87c3" --network scroll_sepolia

# # flare -> oracle (A)
# # flare -> oracle (b)
# hh peers --contract FlareOracle --address "0x3b2cca1570d630052c4691489acf21db20811505" --dsteid 40245 --dstaddress "0x617d0f12771e2c04b95a39dd658d74287f170bcd" --network coston2
# hh peers --contract FlareOracle --address "0x3b2cca1570d630052c4691489acf21db20811505" --dsteid 40170 --dstaddress "0xcd9a7e6561a7e08c53244161a5b0669ee4eff58e" --network coston2
# hh peers --contract FlareOracle --address "0x3b2cca1570d630052c4691489acf21db20811505" --dsteid 40290 --dstaddress "" --network coston2
# hh peers --contract FlareOracle --address "0x3b2cca1570d630052c4691489acf21db20811505" --dsteid 40275 --dstaddress "0x0a0276e831180d44c97481cd6a2e0ebc3704cc6e" --network coston2
# hh peers --contract FlareOracle --address "0x3b2cca1570d630052c4691489acf21db20811505" --dsteid 40231 --dstaddress "0xb2f6c64ab2d7c9f39ceaed5648a879cd7d9f87c3" --network coston2


# # pyth -> oracle (A)
# # pyth -> oracle (b)
# hh peers --contract PythOracle --address "0xac67cf8ea391ad381f7533c451b2da009717bd02" --dsteid 40245 --dstaddress "0x617d0f12771e2c04b95a39dd658d74287f170bcd" --network fuji
# hh peers --contract PythOracle --address "0xac67cf8ea391ad381f7533c451b2da009717bd02" --dsteid 40170 --dstaddress "0xcd9a7e6561a7e08c53244161a5b0669ee4eff58e" --network fuji
# hh peers --contract PythOracle --address "0xac67cf8ea391ad381f7533c451b2da009717bd02" --dsteid 40290 --dstaddress "" --network fuji
# hh peers --contract PythOracle --address "0xac67cf8ea391ad381f7533c451b2da009717bd02" --dsteid 40275 --dstaddress "0x0a0276e831180d44c97481cd6a2e0ebc3704cc6e" --network fuji
# hh peers --contract PythOracle --address "0xac67cf8ea391ad381f7533c451b2da009717bd02" --dsteid 40231 --dstaddress "0xb2f6c64ab2d7c9f39ceaed5648a879cd7d9f87c3" --network fuji


# # oracle (A) -> chronicle, flare, pyth
# hh peers --contract Oracle --address "0x0a0276e831180d44c97481cd6a2e0ebc3704cc6e" --dsteid 40170 --dstaddress "0xecd07d9801e4dd8c87d5f2443cd27b5cf0317f69" --network zircuit_sepolia
# hh peers --contract Oracle --address "0x0a0276e831180d44c97481cd6a2e0ebc3704cc6e" --dsteid 40294 --dstaddress "0x3b2cca1570d630052c4691489acf21db20811505" --network zircuit_sepolia
# hh peers --contract Oracle --address "0x0a0276e831180d44c97481cd6a2e0ebc3704cc6e" --dsteid 40106 --dstaddress "0xac67cf8ea391ad381f7533c451b2da009717bd02" --network zircuit_sepolia

# # oracle (B) -> chronicle, flare, pyth
# hh peers --contract Oracle --address "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --dsteid 40170 --dstaddress "0xb2f6c64ab2d7c9f39ceaed5648a879cd7d9f87c3" --network arbitrum_sepolia
# hh peers --contract Oracle --address "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --dsteid 40294 --dstaddress "0xb2f6c64ab2d7c9f39ceaed5648a879cd7d9f87c3" --network arbitrum_sepolia
# hh peers --contract Oracle --address "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --dsteid 40106 --dstaddress "0xb2f6c64ab2d7c9f39ceaed5648a879cd7d9f87c3" --network arbitrum_sepolia

# hh peers --contract Oracle --address "0x617d0f12771e2c04b95a39dd658d74287f170bcd" --dsteid 40170 --dstaddress "0xb2f6c64ab2d7c9f39ceaed5648a879cd7d9f87c3" --network base_sepolia
# hh peers --contract Oracle --address "0x617d0f12771e2c04b95a39dd658d74287f170bcd" --dsteid 40294 --dstaddress "0xb2f6c64ab2d7c9f39ceaed5648a879cd7d9f87c3" --network base_sepolia
# hh peers --contract Oracle --address "0x617d0f12771e2c04b95a39dd658d74287f170bcd" --dsteid 40106 --dstaddress "0xb2f6c64ab2d7c9f39ceaed5648a879cd7d9f87c3" --network base_sepolia

# hh peers --contract Oracle --address "0xcd9a7e6561a7e08c53244161a5b0669ee4eff58e" --dsteid 40170 --dstaddress "0xb2f6c64ab2d7c9f39ceaed5648a879cd7d9f87c3" --network scroll_sepolia
# hh peers --contract Oracle --address "0xcd9a7e6561a7e08c53244161a5b0669ee4eff58e" --dsteid 40294 --dstaddress "0xb2f6c64ab2d7c9f39ceaed5648a879cd7d9f87c3" --network scroll_sepolia
# hh peers --contract Oracle --address "0xcd9a7e6561a7e08c53244161a5b0669ee4eff58e" --dsteid 40106 --dstaddress "0xb2f6c64ab2d7c9f39ceaed5648a879cd7d9f87c3" --network scroll_sepolia



# Push
# chronicle, flare, pyth
# hh push --contract ChronicleOracle --address "0x15e00f073322da8c03fe2dd15fae7013c0945e53" --params '[]' --network scroll_sepolia
# hh push --contract FlareOracle --address "0x49682be434b2125eaedf0e33dbbe60e89c26fda4" --params '[]' --network coston2
# hh push --contract PythOracle --address "0xecd07d9801e4dd8c87d5f2443cd27b5cf0317f69" --params '[]' --network fuji


# ["58706490654070000000000","3165405034520000000000","1000000000000000000"]