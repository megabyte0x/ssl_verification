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
        const cert = res.socket.getPeerCertificate(true);

        if (cert.raw) {
            console.log("Certificate \n", cert);
            let certificate = cert.raw.toString('base64');
            let data = `${"-----BEGIN CERTIFICATE-----\n" + certificate + "\n-----END CERTIFICATE-----"}`;

            fs.writeFile('cert_chain.pem', data, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('File has been created');
            });

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
