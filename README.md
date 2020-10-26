## ⚠️ Warning

Any content produced by Solana, or developer resources that Solana provides, are for educational and inspiration purposes only.  Solana does not encourage, induce or sanction the deployment of any such applications in violation of applicable laws or regulations.

## Deployment

App is using to enviroment variables that can be set before deployment:
* `SWAP_PROGRAM_OWNER_FEE_ADDRESS` used to distribute fees to owner of the pool program (Note: this varibale reuqires special version of token-swap program)
* `SWAP_HOST_FEE_ADDRESS` used to distribute fees to host of the application

To inject varibles to the app, set the SWAP_PROGRAM_OWNER_FEE_ADDRESS and/or SWAP_HOST_FEE_ADDRESS environment variables to the addresses of your SOL accounts.

You may want to put these in local environment files (e.g. .env.development.local, .env.production.local). See the documentation on environment variables for more information.

NOTE: remember to re-build your app before deploying for your referral addresses to be reflected.