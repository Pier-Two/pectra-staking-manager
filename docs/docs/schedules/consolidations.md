# Consolidations

This is a schedule that will hit the `/app/api/consolidate` route every hour.

This route will find every `ACTIVE` consolidation that's stored in our Mongo DB and look to process them. One by one we iterate through the active consolidations and we check how that transaction is doing using `Beaconcha.in` APIs.

The entire purpose of this rote is to identify when a consolidation that was actioned on our application has been successfully processed so we can email the user to notify them. If the transaction is not yet complete as transactions can take > 12 hours to process then we do nothing with the document in Mongo and we'll try to process it an hour later. However, if the transaction has been successfully processed we send the email using Pier Two's API and we mark that document in Mongo as `INACTIVE` essentially archiving the data.

A consolidation is considered as processed when the validator in question has a balance of 0 and the status of the validator is classed as `Exited (not active)`
