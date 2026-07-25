const token = 'ZUbMIMi664bXpHv9tRadLUHTL2WgjkMIC_R1SleT71k';
const query = `
query {
  channel(input: { id: "6a48e2da5ab6d2f106a2ff9b" }) {
    id
    name
    service
    metadata {
      ... on PinterestMetadata {
        boards {
          id
          name
        }
      }
    }
  }
}
`;

fetch('https://api.buffer.com', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query })
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(err => console.error(err));
