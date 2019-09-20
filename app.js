//Imports
const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const googleTranslate = require("google-translate")(
 
);
const { TesseractWorker } = require("tesseract.js");

const worker = new TesseractWorker();

//Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage }).single("avatar");

app.set("view engine", "ejs");
app.use(express.static("public"));
//Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", (req, res) => {
  upload(req, res, err => {
    fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
      if (err) return console.log("This is your error message", err);

      worker
        .recognize(data, "eng", { tessjs_create_pdf: "1" })

        .progress(progress => {
          console.log(progress);
        })

        .then(result => {
          let text = result.text;
          googleTranslate.translate(text, "hu", function(err, translation) {
            let translationTextResult = translation.translatedText;
            console.log(text);
            console.log(translationTextResult);
            res.send(`Original Text: ${text} <br/> Translated Text: ${translationTextResult}`);
          });
          
          // res.redirect("/download");
        })
        .finally(() => {
          worker.terminate();
        });
    });
  });
});

app.get("/download", (req, res) => {
  const file = `${__dirname}/tesseract.js-ocr-result.pdf`;
  // const translatedFile = `${__dirname}/tesseract.js-ocr-result-hu.pdf`;
  res.download(file);
  // await res.download(translatedFile);
});

//Start up our server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Hey I'm running on port ${PORT}`));
