const Parser = require("rss-parser");
const parser = new Parser();
const { stripHtml } = require("string-strip-html");

async function fetchRssFeeds(feedUrls = []) {
  const allItems = [];

  for (const url of feedUrls) {
    try {
      const feed = await parser.parseURL(url);
      const items = feed.items.map((item) => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: stripHtml(item.contentSnippet || item.description || "")
          .result,
        image: item.enclosure?.url || null,
        source: feed.title,
      }));
      allItems.push(...items);
    } catch (error) {
      console.error(`Failed to fetch RSS from ${url}:`, error.message);
    }
  }

  return allItems;
}

module.exports = {
  fetchRssFeeds,
};
