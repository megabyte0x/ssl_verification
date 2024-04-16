# SSL Verification

This is a simple script in Node.js that extracts the SSL certificate information from a given URL and verifies it using OpenSSL.

## Installation

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `node index.js` to run the script

This will extract the certificates from the URL and send them to the `fetched` folder.

## Verify the Certificates

To verify the SSL certificates, you need to have Root CA Certificates. 

I have saved a few and combined them into a single file named as `combined_ceritificates.pem`. You can use this file to verify the certificates and can add more.

To verify the certificates, run the following command:

```bash
openssl verify -CAfile combined_certificates.pem -untrusted fetched/intermediate_cert.pem fetched/server_cert.pem 
```

Here:

- `openssl verify`: The command to verify the certificates
- `CAfile combined_certificates.pem`: The file containing the Root CA Certificates
- `untrusted`: This marks the provided intermediate certificate as untrusted but a valid part to complete the chain.
- `fetched/intermediate_cert.pem`: The intermediate certificate extracted from the URL
- `fetched/server_cert.pem`: The server certificate extracted from the URL which needs to be verified.  

This will verify the certificates and output the following result:
```bash
fetched/server_cert.pem: OK
```

