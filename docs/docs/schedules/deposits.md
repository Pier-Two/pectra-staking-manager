# Deposits

This is a schedule that will hit the `/app/api/deposit` route every hour.

This route will find every `ACTIVE` deposit that's stored in our Mongo DB and look to process them. One by one we iterate through the active deposits and we check how that transaction is doing using `Beaconcha.in` APIs.

The entire purpose of this rote is to identify when a deposit that was actioned on our application has been successfully processed so we can email the user to notify them. If the transaction is not yet complete as transactions can take > 12 hours to process then we do nothing with the document in Mongo and we'll try to process it an hour later. However, if the transaction has been successfully processed we send the email using Pier Two's API and we mark that document in Mongo as `INACTIVE` essentially archiving the data.

A deposit is considered as processed when the transaction hash generated on the frontend is now pesent in the response that comes back from the Beaconcha.in API. We're able to see a list of all prior deposits associated with the validator in question so it's an easy check to see if our new transaction has is detected on chain.
