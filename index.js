const http = require('http');

exports.handler = async (event) => {
    console.log("S3 Event Received:", JSON.stringify(event));

    // إعدادات الاتصال بخدمة الإشعارات عن طريق الـ Ingress
    const options = {
        hostname: '172.18.0.4',
        port: 80,
        path: '/notifications', // أو المسار الصحيح لو مختلف
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });

        req.on('error', (e) => reject(e.message));
        req.write(JSON.stringify({ 
            message: "New ticket uploaded to S3!",
            s3Object: event.Records[0].s3.object.key
        }));
        req.end();
    });
};