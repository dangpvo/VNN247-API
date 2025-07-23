const rssService = require("../services/rssService");

exports.getHome = async (req, res) => {
  const [tinMoi, tinHot, giaoDuc, kinhTe, baiViet] = await Promise.all([
    rssService.getRSS("tin-moi"),
    rssService.getRSS("tin-hot"),
    rssService.getRSS("giao-duc"),
    rssService.getRSS("kinh-te"),
    rssService.getRSS("bai-viet"),
  ]);

  res.render("home", {
    tinMoi,
    tinHot,
    giaoDuc,
    kinhTe,
    baiViet,
  });
};
