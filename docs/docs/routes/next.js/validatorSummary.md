# Validator Summary

This is a unique route on the application. This route doesn't get called via code or via Upstash but is instead triggered directly from Mongo

The Mongo trigger is called `generate_validator_summary` and it's setup at the moment to run once an hour (but we are considering extending that time period). What this route does is it queries `Quicknode` to get all active validators and processes the data before storing it in Mongo giving us information such as:

- Withdrawal Credential Prefix
- Total ETH Staked
- Validator Count
- Average ETH Staked
