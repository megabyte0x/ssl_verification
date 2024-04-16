const https = require('https');
const fs = require('fs');

async function getCertificateChain(url) {
    const options = {
        hostname: url,
        port: 443,
        method: 'GET',
        agent: new https.Agent({ rejectUnauthorized: false }) // to get the cert even if invalid
    };

    const req = https.request(options, async (res) => {
        const certificate = res.socket.getPeerCertificate(true);
        console.log("Complete Certificate \n", certificate);
        if (certificate.raw) {
            let server_certitificate = certificate.raw.toString('base64');
            let server_certitificate_data = `${"-----BEGIN CERTIFICATE-----\n" + server_certitificate + "\n-----END CERTIFICATE-----"}`;
            fs.writeFile('fetched/server_cert.pem', server_certitificate_data, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Server Certificate has been created');
            });

            if (certificate.issuerCertificate) {
                let intermediate_certitificate = certificate.issuerCertificate.raw.toString('base64');
                let intermediate_certitificate_data = `${"-----BEGIN CERTIFICATE-----\n" + intermediate_certitificate + "\n-----END CERTIFICATE-----"}`;
                fs.writeFile('fetched/intermediate_cert.pem', intermediate_certitificate_data, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('Intermediate Certificate has been created');
                });

                if (certificate.issuerCertificate.issuerCertificate) {
                    let root_certitificate = certificate.issuerCertificate.issuerCertificate.raw.toString('base64');
                    let root_certitificate_data = `${"\n-----BEGIN CERTIFICATE-----\n" + root_certitificate + "\n-----END CERTIFICATE-----"}`;
                    fs.writeFile('fetched/root_cert.pem', root_certitificate_data, (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        console.log('Root Certificate has been created');
                    });
                }
            }
        } else {
            console.log('No certificate retrieved.');
        }
    });

    req.on('error', (e) => {
        console.error(e);
    });
    req.end();
}

getCertificateChain('0rbit.co');
