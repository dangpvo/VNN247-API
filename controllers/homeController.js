const rssService = require("../services/rssService");

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
  const allNews = [];

  for (const feed of Object.keys(rssMap)) {
    const news = await rssService.fetchRSS(rssMap[feed], 2);
    news.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    allNews.push({ [feed]: [...news] });
  }

  res.json(allNews);
};
