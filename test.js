fetch('https://api.buffer.com', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer BDakrNjoW-F57QcoDIFRpsdspVT-5e9WzQnFrRgAAmj',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: '{ channels(input: { organizationId: "6a48ebef7add101768ce8b67" }) { id name service } }'
  })
}).then(r=>r.json()).then(d=>console.log(JSON.stringify(d, null, 2))).catch(console.error);
