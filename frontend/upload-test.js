const fs = require('fs');
const path = require('path');
(async () => {
  const filePath = path.resolve(__dirname, 'sample-upload-test.txt');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, 'Sample upload content for validation.');
  }

  const creds = { email: 'user@example.com', password: 'Password123!' };
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds)
  });

  if (!loginRes.ok) {
    const text = await loginRes.text();
    throw new Error(`Login failed ${loginRes.status}: ${text}`);
  }

  const loginData = await loginRes.json();
  console.log('LOGIN OK');
  const token = loginData.token;

  const docsRes = await fetch('http://localhost:4000/api/documents/user', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const docs = await docsRes.json();
  console.log('DOCS', JSON.stringify(docs, null, 2));

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  formData.append('customer_code', 'CUST1001');
  formData.append('send_to_ca', 'true');

  const uploadRes = await fetch('http://localhost:4000/api/documents/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  const uploadData = await uploadRes.json();
  console.log('UPLOAD STATUS', uploadRes.status);
  console.log('UPLOAD RESPONSE', JSON.stringify(uploadData, null, 2));
})();
