fetch('https://api.buffer.com', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ZUbMIMi664bXpHv9tRadLUHTL2WgjkMIC_R1SleT71k',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: `
      mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          ... on PostActionSuccess {
            post {
              id
              text
            }
          }
        }
      }
    `,
    variables: {
      input: {
        channelId: "6a48def65ab6d2f106a2f353",
        text: "Automated Pinterest test using Buffer API! https://review-scout-pi.vercel.app/",
        mode: "shareNow",
        schedulingType: "automatic",
        assets: [
          {
             image: { url: "https://image.pollinations.ai/prompt/high%20tech%20robot%20posting%20to%20social%20media?width=1000&height=1500&nologo=true" }
          }
        ]
      }
    }
  })
}).then(r=>r.json()).then(d=>console.log(JSON.stringify(d, null, 2))).catch(console.error);
