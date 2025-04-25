# Validators
We have a few different routes for validators on this application.

### getValidators

This route gets all the validators associated with your connected wallet. This is probably the most important thing about the application as without validators you can't do any of the flows. When we get the validators back from `Beaconcha.in` we format the data into a specific model which we then use site wide.

### getValidatorsPerformanceInWei

This route gets either the `daily`, `monthly`, `yearly` or `total` performance of all your validators and returns that accumulation in wei. We then take this wei value on the client side and convert it into a readable total in `ETH` and `USD`

### getValidatorDetails

This route gets the specific details about a single validator that is not associated with your connected wallet. It's essentially an external lookup using a validators public key so we can then use it for integration within our application

### updateConsolidationRecord

This route looks to manage consolidation records in ourMongo DB. It will create non existent records for us with up to date transaction hash's, user emails etc