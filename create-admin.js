const http = require('http');

const data = JSON.stringify({
    name: 'Admin',
    email: 'admin@gmail.com',
    phone: '01700000001',
    nid: '1234567890123',
    password: 'admin@gmail.com'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = http.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
            const parsed = JSON.parse(responseBody);
            console.log('Success:', parsed.success);
            if (parsed.data) {
                console.log('\n=== ADMIN CREDENTIALS ===');
                console.log('Email:', parsed.data.user.email);
                console.log('Password: IeltsAdmin@123');
                console.log('Role:', parsed.data.user.role);
                console.log('========================\n');
            } else {
                console.log('Message:', parsed.message);
            }
        } catch (e) {
            console.log('Response:', responseBody);
        }
    });
});

req.on('error', (e) => {
    console.error('Error:', e.message);
});

req.write(data);
req.end();
