# Charts

This is a route that we use to build all the chart data we need for the welcome screen. We have a separate route which populates validator data into our Mongo DB once every few hours. This Charts route will fetch all that data and process it into a format that is compatible with our `Recharts` component.

The charts we display include:

- Total amount of ETH staked for each upgrade
- Number of validators on each upgrade
- Average amount of ETH staked for each upgrade

The data processing for these charts is quite complex and it heavily relies on the `timestamp` field being unified across 0x00, 0x01 and 0x02 each time we write to the DB. We would expect 3 and only 3 records to have the exact same timestamp.
