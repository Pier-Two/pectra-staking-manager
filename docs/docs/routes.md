---
sidebar_position: 2
---

# Routes

# TRPC

We use trpc for client-side fetching and storing of requests.

# Processing requests

To handle processing requests we have created a webhook that is only callable by Upstash.

This webhook iterates over all our supported networks, processing deposits, withdrawals and consolidations.

# Validator summary

We also have a separate cron job that is called by Mongo and processes validator statistics on the Beaconchain network and stores it for our charts to use.
