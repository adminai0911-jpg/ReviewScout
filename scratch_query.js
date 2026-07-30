require('dotenv').config({ path: '.env' });
const query = `
query {
  channel(input: { id: "${process.env.BUFFER_PINTEREST_CHANNEL_ID}" }) {
    metadata {
      ... on PinterestMetadata {
        boards {
          name
          serviceId
        }
      }
    }
  }
}`;
fetch('https://api.buffer.com', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + process.env.BUFFER_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query })
}).then(res => res.json()).then(data => console.log(JSON.stringify(data, null, 2))).catch(console.error);
