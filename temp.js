fetch('https://api.buffer.com', { 
    method: 'POST', 
    headers: { 
        'Authorization': 'Bearer ZUbMIMi664bXpHv9tRadLUHTL2WgjkMIC_R1SleT71k', 
        'Content-Type': 'application/json' 
    }, 
    body: JSON.stringify({ 
        query: 'query { channels(input: { organizationId: "6a34ba80247c815ecc84ac96" }) { id name service } }' 
    }) 
}).then(r=>r.json()).then(d => console.log(JSON.stringify(d, null, 2))).catch(console.error);
