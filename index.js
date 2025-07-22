const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const cors = require("cors");
const NodeCache = require("node-cache");

const app = express();
const { stripHtml } = require("string-strip-html");
const { decode } = require("html-entities");

const PORT = 3000;
const parser = new xml2js.Parser({ explicitArray: false });
const cache = new NodeCache({ stdTTL: 300 }); // cache 5 phút

app.use(cors());

// Cấu hình danh sách RSS
const rssFeeds = [
  { source: "VnExpress", url: "https://vnexpress.net/rss/the-gioi.rss" },
  { source: "ThanhNien", url: "https://thanhnien.vn/rss/thoi-su.rss" },
  { source: "TuoiTre", url: "https://tuoitre.vn/rss/thoi-su.rss" },
  { source: "DanTri", url: "https://dantri.com.vn/rss/su-kien.rss" },
  { source: "PhapLuat", url: "https://plo.vn/rss/thoi-su-1.rss" },
];

const normalizeItem = (item, source) => {
  let image = null;

  // Ưu tiên ảnh trong enclosure
  if (item.enclosure?.["$"]?.url) {
    image = item.enclosure["$"].url;
  }

  // Nếu không có enclosure, tìm <img> trong description
  if (!image && item.description) {
    const match = item.description.match(/<img[^>]+src="([^">]+)"/);
    if (match && match[1]) {
      image = match[1];
    }
  }

  // Nếu vẫn không có, thử thumb hoặc image (PLO)
  if (!image && item.thumb) image = item.thumb;
  if (!image && item.image) image = item.image;

  return {
    title: decode(item.title || ""),
    link: item.link,
    pubDate: item.pubDate,
    description: stripHtml(item.description)?.result.slice(0, 200) || "",
    image,
    source,
  };
};

// Hàm fetch và chuẩn hóa dữ liệu
async function fetchRSS(feed) {
  const cached = cache.get(feed.url);
  if (cached) return cached;

  try {
    const res = await axios.get(feed.url);
    const parsed = await parser.parseStringPromise(res.data);

    const items = parsed.rss.channel.item.map((item) => {
      console.log(feed.source);
      console.log(item);

      return normalizeItem(item, feed.source);
    });

    cache.set(feed.url, items);
    return items;
  } catch (error) {
    console.error(`Lỗi tải RSS từ ${feed.source}`, error.message);
    return [];
  }
}

// API endpoint chính
app.get("/api/news", async (req, res) => {
  const allNews = [];

  for (const feed of rssFeeds) {
    const news = await fetchRSS(feed);
    allNews.push(...news);
  }

  // Sắp xếp theo ngày mới nhất
  allNews.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  res.json(allNews.slice(0, 50)); // trả về 50 tin gần nhất
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
