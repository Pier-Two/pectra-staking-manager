# Withdrawals

This is a schedule that will hit the `/app/api/withdrawal` route every hour.

This route will find every `ACTIVE` deposit that's stored in our Mongo DB and look to process them. One by one we iterate through the active withdrawals and we check how that transaction is doing using `Beaconcha.in` APIs.

The entire purpose of this rote is to identify when a withdrawal that was actioned on our application has been successfully processed so we can email the user to notify them. If the transaction is not yet complete as transactions can take > 12 hours to process then we do nothing with the document in Mongo and we'll try to process it an hour later. However, if the transaction has been successfully processed we send the email using Pier Two's API and we mark that document in Mongo as `INACTIVE` essentially archiving the data.

When we write a withdrawal into Mongo, we capture the current highest withdrawal index against that validator. This could be 0 or it could be 100 etc. A withdrawal is considered as processed when the highest withdrawal index coming back from the live Beaconcha.in API is higher than the withdrawal index we have stored in the DB.
