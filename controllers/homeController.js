const rssService = require("../services/rssService");

const NodeCache = require("node-cache");
const cache = new NodeCache();

const rssMap = {
  latestNews: [
    {
      source: "VnExpress",
      url: "https://vnexpress.net/rss/tin-moi-nhat.rss",
    },
    {
      source: "ThanhNien",
      url: "https://thanhnien.vn/rss/chao-ngay-moi.rss",
    },
  ],
  hotNews: [
    {
      source: "VnExpress",
      url: "https://vnexpress.net/rss/tin-noi-bat.rss",
    },
    {
      source: "DanTri",
      url: "https://dantri.com.vn/rss/tam-diem.rss",
    },
  ],
  economy: [
    {
      source: "VnExpress",
      url: "https://vnexpress.net/rss/kinh-doanh.rss",
    },
    {
      source: "ThanhNien",
      url: "https://thanhnien.vn/rss/thi-truong.rss",
    },
    {
      source: "ThanhNien",
      url: "https://thanhnien.vn/rss/kinh-te.rss",
    },
    {
      source: "TuoiTre",
      url: "https://tuoitre.vn/rss/kinh-doanh.rss",
    },
    {
      source: "DanTri",
      url: "https://dantri.com.vn/rss/kinh-doanh.rss",
    },
    {
      source: "DanTri",
      url: "https://dantri.com.vn/rss/bat-dong-san.rss",
    },
    {
      source: "PhapLuat",
      url: "https://plo.vn/rss/kinh-te-13.rss",
    },
  ],
  education: [
    {
      source: "VnExpress",
      url: "https://vnexpress.net/rss/giao-duc.rss",
    },
    {
      source: "ThanhNien",
      url: "https://thanhnien.vn/rss/giao-duc.rss",
    },
    {
      source: "TuoiTre",
      url: "https://tuoitre.vn/rss/giao-duc.rss",
    },
    {
      source: "DanTri",
      url: "https://dantri.com.vn/rss/giao-duc.rss",
    },
    {
      source: "PhapLuat",
      url: "https://plo.vn/rss/giao-duc-21.rss",
    },
    {
      source: "PhapLuat",
      url: "https://plo.vn/rss/giao-duc/chon-truong-chon-nghe-313.rss",
    },
  ],
  articles: [
    {
      source: "ThanhNien",
      url: "https://thanhnien.vn/rss/blog-phong-vien.rss",
    },
    {
      source: "ThanhNien",
      url: "https://thanhnien.vn/rss/toi-viet.rss",
    },
    {
      source: "DanTri",
      url: "https://dantri.com.vn/rss/photo-news.rss",
    },
    {
      source: "PhapLuat",
      url: "https://plo.vn/rss/thoi-su-/chinh-kien-250.rss",
    },
    {
      source: "PhapLuat",
      url: "https://plo.vn/rss/thoi-su/theo-dong-thoi-su-4.rss",
    },
  ],
};

exports.getHome = async (req, res) => {
  const cached = cache.get("homeData");
  if (cached) {
    return res.json(cached);
  }

  try {
    const fetchTasks = Object.entries(rssMap).map(async ([key, feeds]) => {
      const news = await rssService.fetchRSS(feeds, 2);
      return { [key]: news };
    });

    const results = await Promise.all(fetchTasks);
    const allNews = Object.assign({}, ...results);

    cache.set("homeData", allNews, 180); // cache 3 phút
    res.json(allNews);
  } catch (err) {
    console.error("Lỗi khi xử lý trang chủ:", err.message);
    res.status(500).json({ error: "Lỗi khi tải trang chủ" });
  }
};
