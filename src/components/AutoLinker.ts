export function processAutoLinks(content: string, productName: string): string {
  if (!content) return content;
  
  let newContent = content;

  const keywords = [
    "Amazon", 
    "Check Price", 
    "Buy now", 
    "Best price", 
    "Available here",
    "Click here",
    "View on Amazon",
    "Check it out"
  ];

  const affiliateId = "inamazon0f2-21";
  const rawUrl = `https://www.amazon.com/s?k=${encodeURIComponent(productName || "best products")}&tag=${affiliateId}`;
  const cloakedUrl = `/api/go?url=${encodeURIComponent(rawUrl)}`;

  keywords.forEach(kw => {
    // Regex matches the keyword not surrounded by markdown link brackets
    const regex = new RegExp(`(?<!\\[[^\\]]*)(?<!\\([^\\]]*)\\b(${kw})\\b(?![^\\[]*\\])(?![^\\(]*\\))`, 'gi');
    newContent = newContent.replace(regex, `[$1](${cloakedUrl})`);
  });

  return newContent;
}
