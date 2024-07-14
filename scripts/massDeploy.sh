#!/bin/bash

# Deploy the tokens
# hh deploy:custom --contract Token --params '["Wrapped Bitcoin", "WBTC"]' --network arbitrum_sepolia
# hh deploy:custom --contract Token --params '["Wrapped Bitcoin", "WBTC"]' --network zircuit_sepolia
# hh deploy:custom --contract Token --params '["Wrapped Ethereum", "WETH"]' --network arbitrum_sepolia
# hh deploy:custom --contract Token --params '["Wrapped Ethereum", "WETH"]' --network zircuit_sepolia

# Deploy the individual oracles
# hh deploy:custom --contract ChronicleOracle --params '["0x6EDCE65403992e310A62460808c4b910D972f10f", "0xCf12de817eb7b858E15175f42483997DD0Ac9bd5", ["40275", "40231"], ["0x4B5aBFC0Fe78233b97C80b8410681765ED9fC29c", "0xc8A1F9461115EF3C1E84Da6515A88Ea49CA97660"], "0x0Dcc19657007713483A5cA76e6A7bbe5f56EA37d"]' --network scroll_sepolia
# hh deploy:custom --contract FlareOracle --params '["0x6EDCE65403992e310A62460808c4b910D972f10f", "0xCf12de817eb7b858E15175f42483997DD0Ac9bd5", ["40275", "40231"]]' --network coston2
# hh deploy:custom --contract PythOracle --params '["0x6EDCE65403992e310A62460808c4b910D972f10f", "0xCf12de817eb7b858E15175f42483997DD0Ac9bd5", ["40275", "40231"], "0x23f0e8FAeE7bbb405E7A7C3d60138FCfd43d7509", ["0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace"]]' --network fuji

# Deploy the master oracle 
# hh deploy:custom --contract Oracle --params '["0x6EDCE65403992e310A62460808c4b910D972f10f", "0xCf12de817eb7b858E15175f42483997DD0Ac9bd5"]' --network zircuit_sepolia
# hh deploy:custom --contract Oracle --params '["0x6EDCE65403992e310A62460808c4b910D972f10f", "0xCf12de817eb7b858E15175f42483997DD0Ac9bd5"]' --network arbitrum_sepolia

# deploy the pool factory
hh deploy:custom --contract PoolSrcFactory --params '[]' --network zircuit_sepolia
# hh deploy:custom --contract PoolDstFactory --params '[]' --network zircuit_sepolia
hh deploy:custom --contract PoolSrcFactory --params '[]' --network arbitrum_sepolia
# hh deploy:custom --contract PoolDstFactory --params '[]' --network arbitrum_sepolia

# setPeer to the different apps
# # chronicle -> oracle (A)
# # chronicle -> oracle (b)
# hh peers --contract ChronicleOracle --address "0x15e00f073322da8c03fe2dd15fae7013c0945e53" --dsteid 40275 --dstaddress "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --network scroll_sepolia
# hh peers --contract ChronicleOracle --address "0x15e00f073322da8c03fe2dd15fae7013c0945e53" --dsteid 40231 --dstaddress "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --network scroll_sepolia

# # flare -> oracle (A)
# # flare -> oracle (b)
# hh peers --contract FlareOracle --address "0x49682be434b2125eaedf0e33dbbe60e89c26fda4" --dsteid 40275 --dstaddress "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --network coston2
# hh peers --contract FlareOracle --address "0x49682be434b2125eaedf0e33dbbe60e89c26fda4" --dsteid 40231 --dstaddress "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --network coston2

# # pyth -> oracle (A)
# # pyth -> oracle (b)
# hh peers --contract PythOracle --address "0xecd07d9801e4dd8c87d5f2443cd27b5cf0317f69" --dsteid 40275 --dstaddress "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --network fuji
# hh peers --contract PythOracle --address "0xecd07d9801e4dd8c87d5f2443cd27b5cf0317f69" --dsteid 40231 --dstaddress "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --network fuji

# # oracle (A) -> chronicle, flare, pyth
# hh peers --contract Oracle --address "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --dsteid 40170 --dstaddress "0x15e00f073322da8c03fe2dd15fae7013c0945e53" --network zircuit_sepolia
# hh peers --contract Oracle --address "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --dsteid 40294 --dstaddress "0x49682be434b2125eaedf0e33dbbe60e89c26fda4" --network zircuit_sepolia
# hh peers --contract Oracle --address "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --dsteid 40106 --dstaddress "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --network zircuit_sepolia

# # oracle (B) -> chronicle, flare, pyth
# hh peers --contract Oracle --address "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --dsteid 40170 --dstaddress "0x15e00f073322da8c03fe2dd15fae7013c0945e53" --network arbitrum_sepolia
# hh peers --contract Oracle --address "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --dsteid 40294 --dstaddress "0x49682be434b2125eaedf0e33dbbe60e89c26fda4" --network arbitrum_sepolia
# hh peers --contract Oracle --address "0xb2f38ed980c2671a01e7c33e3215cbccc40e7bf6" --dsteid 40106 --dstaddress "0xecd07d9801e4dd8c87d5f2443cd27b5cf0317f69" --network arbitrum_sepolia

# Push
# chronicle, flare, pyth
# hh push --contract ChronicleOracle --address "0x15e00f073322da8c03fe2dd15fae7013c0945e53" --params '[]' --network scroll_sepolia
# hh push --contract FlareOracle --address "0x49682be434b2125eaedf0e33dbbe60e89c26fda4" --params '[]' --network coston2
# hh push --contract PythOracle --address "0xecd07d9801e4dd8c87d5f2443cd27b5cf0317f69" --params '[]' --network fuji
