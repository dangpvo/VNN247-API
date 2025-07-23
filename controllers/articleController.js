const rssService = require("../services/rssService");

exports.getMain = async (req, res) => {
  const [vanHoa, toiViet, hinhAnh, thoiLuan, hoSo, theThao] = await Promise.all(
    [
      rssService.getRSS("van-hoa"),
      rssService.getRSS("toi-viet"),
      rssService.getRSS("hinh-anh"),
      rssService.getRSS("thoi-luan"),
      rssService.getRSS("ho-so"),
      rssService.getRSS("chuyen-the-thao"),
    ]
  );

  res.render("articleMain", {
    vanHoa,
    toiViet,
    hinhAnh,
    thoiLuan,
    hoSo,
    theThao,
  });
};
