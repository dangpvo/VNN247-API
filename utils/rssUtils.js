const express = require("express");
const { stripHtml } = require("string-strip-html");
const { decode } = require("html-entities");

class RssUtils {
  static safeParseDate(dateString) {
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  static normalizeItem(item, source, pubDate = new Date()) {
    let image = null;

    // Ưu tiên ảnh trong enclosure
    if (item.enclosure?.["$"]?.url) {
      image = item.enclosure["$"].url;
    }

    // Nếu không có enclosure, tìm <img> trong description
    if (!image && item.description) {
      const match = item.description.match(/<img[^>]+src=['"]([^'"]+)['"]/);

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
      pubDate: this.safeParseDate(item.pubDate),
      description: stripHtml(item.description)?.result.slice(0, 200) || "",
      image,
      source,
    };
  }
}

module.exports = RssUtils;
