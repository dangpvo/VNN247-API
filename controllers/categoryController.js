const rssService = require("../services/rssService");

exports.getCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const items = await rssService.getRSS(category);
    res.render("category", {
      title: category,
      items,
    });
  } catch (err) {
    res.status(404).send("Không tìm thấy chuyên mục");
  }
};
