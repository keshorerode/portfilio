const https = require('https');

const API_KEY = 'AIzaSyBAFtJxACoWoGo0tSqxRRSuOZq2CnO4mJA';

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models?key=${API_KEY}`,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
};

console.log('Listing models...');

const req = https.request(options, (res) => {
    let responseData = '';
    res.on('data', (chunk) => responseData += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(responseData);
            if (json.models) {
                json.models.forEach(m => console.log(m.name));
            } else {
                console.log('No models or error:', json);
            }
        } catch (e) {
            console.log('Error parsing JSON');
        }
    });
});

req.on('error', (e) => console.error(e));
req.end();
