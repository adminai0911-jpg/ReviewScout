
require('dotenv').config();
const key = process.env.BUFFER_API_KEY;
const channelId = process.env.BUFFER_TWITTER_CHANNEL_ID;
const q = \mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { ... on PostActionSuccess { post { id } } } }\;
const v = { input: { channelId, text: 'Test from script file', mode: 'shareNow', schedulingType: 'automatic' } };
fetch('https://api.buffer.com/1/graphql', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: q, variables: v })
}).then(r => r.json()).then(d => { console.log(JSON.stringify(d, null, 2)); process.exit(0); }).catch(e => { console.error(e); process.exit(1); });

