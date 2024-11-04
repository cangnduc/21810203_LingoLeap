const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "..", "uploads", "audio");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    //remove ext from orginalname, example: song.mp3 -> song
    const suffix = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );

    const filename =
      suffix.substring(0, 20) +
      "-" +
      uniqueSuffix +
      path.extname(file.originalname);
    req.audioFilename = filename;

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("file", file);
  const allowedMimes = ["audio/mpeg", "audio/wav", "audio/ogg"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only MP3, WAV, and OGG audio files are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1000 * 1024 * 1024 }, // 10 MB file size limit
});

module.exports = upload;
