require('dotenv').config();

async function testPinterest() {
    console.log(`🚀 Testing Pinterest API Native Posting...`);
    
    const pinToken = process.env.PINTEREST_ACCESS_TOKEN;
    if (!pinToken) {
        console.log("❌ ERROR: PINTEREST_ACCESS_TOKEN is missing.");
        return;
    }

    try {
        console.log(`1️⃣ Fetching your Pinterest Boards...`);
        const boardsReq = await fetch('https://api.pinterest.com/v5/boards', {
            headers: { 'Authorization': `Bearer ${pinToken}` }
        });
        
        if (!boardsReq.ok) {
            console.log(`❌ Failed to fetch boards: ${await boardsReq.text()}`);
            return;
        }

        const boardsData = await boardsReq.json();
        if (!boardsData.items || boardsData.items.length === 0) {
            console.log("❌ ERROR: No Pinterest boards found.");
            return;
        }
        
        const boardId = boardsData.items[0].id;
        console.log(`✅ Selected Board ID: ${boardId} (${boardsData.items[0].name})`);

        console.log(`2️⃣ Creating a Test Pin...`);
        const pinPayload = {
            board_id: boardId,
            title: "🚀 ReviewScout Test Pin",
            description: "If you are seeing this on Pinterest, the automated API integration is 100% working perfectly! #test #automation",
            link: "https://review-scout-pi.vercel.app/",
            media_source: {
                source_type: "image_url",
                url: "https://image.pollinations.ai/prompt/high%20tech%20robot%20posting%20to%20social%20media%20cinematic?width=1000&height=1500&nologo=true"
            }
        };

        const pinResponse = await fetch('https://api.pinterest.com/v5/pins', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${pinToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pinPayload)
        });

        if (pinResponse.ok) {
            const data = await pinResponse.json();
            console.log(`\n🎉 SUCCESS! Test pin published directly to Pinterest!`);
            console.log(`Check your Pinterest board to see it!`);
            console.log(`Pin ID: ${data.id}`);
        } else {
            console.log(`❌ Failed to post Pin: ${await pinResponse.text()}`);
        }
    } catch (err) {
        console.error("❌ Crash:", err);
    }
}

testPinterest();
