const url = "https://hook.eu1.make.com/2s4d8y77a4y89a3r4ckqvykjujjgh9ll";
const payload = {
    title: "Awesome Product",
    description: "Check out this amazing product! #awesome",
    imageUrl: "https://via.placeholder.com/1000x1500.jpg",
    link: "https://reviewscout-pi.vercel.app/article/test-article"
};

fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
}).then(res => {
    console.log("Ping successful! Status:", res.status);
}).catch(err => {
    console.error("Ping failed:", err);
});
