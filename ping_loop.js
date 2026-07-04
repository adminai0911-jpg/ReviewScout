const url = "https://hook.eu1.make.com/2s4d8y77a4y89a3r4ckqvykjujjgh9ll";
const payload = {
    title: "Awesome Product",
    description: "Check out this amazing product! #awesome",
    imageUrl: "https://image.pollinations.ai/prompt/awesome%20product?width=1000&height=1500&nologo=true",
    link: "https://reviewscout-pi.vercel.app/article/test-article"
};

console.log("Starting extended ping loop...");
let count = 0;
const interval = setInterval(() => {
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(res => {
        console.log(`Ping ${count+1} sent. Status:`, res.status);
    }).catch(err => {
        console.error("Ping failed:", err);
    });
    
    count++;
    if (count >= 60) {
        clearInterval(interval);
        console.log("Ping loop finished.");
    }
}, 3000);
