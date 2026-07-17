const fs = require("node:fs/promises");
const path = require("path");

const photoPath = path.join(__dirname, "public", "images");

const readFiles = async () => {
  try {
    const files = await fs.readdir(photoPath); //array
    return files;
  } catch (e) {
    console.error(e);
  }
};

module.exports = readFiles;
