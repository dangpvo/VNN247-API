const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const NodeCache = require("node-cache");

// const Parser = require("rss-parser");
// const parser = new Parser();
const parser = new xml2js.Parser({ explicitArray: false });
const cache = new NodeCache({ stdTTL: 300 }); // cache 5 phút
const { stripHtml } = require("string-strip-html");
const RssUtils = require("../utils/rssUtils");

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

async function fetchRSS(feedUrls = [], cutItems = 0) {
  const allItems = [];

  for (const feed of feedUrls) {
    const cached = cache.get(feed.url);
    if (cached) {
      if (cutItems !== 0) {
        allItems.push(...cached.slice(0, cutItems));
      } else {
        allItems.push(...cached);
      }
    }

    try {
      const res = await axios.get(feed.url);
      const parsed = await parser.parseStringPromise(res.data);

      const items = parsed.rss.channel.item.map((item) => {
        return RssUtils.normalizeItem(
          item,
          feed.source,
          parsed.rss.channel.pubDate
        );
      });

      cache.set(feed.url, items);

      if (cutItems !== 0) {
        allItems.push(...items.slice(0, cutItems));
      } else {
        allItems.push(...items);
      }
    } catch (error) {
      console.error(`Lỗi tải RSS từ ${feed.source}`, error.message);
    }
  }

  return allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

module.exports = {
  fetchRssFeeds,
  fetchRSS,
};
