//Imports
const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const routes = require("./routes/routes");
const googleTranslate = require("google-translate")(
  "AIzaSyBAW3sA0BplDK2ox7yJkI2iMKtHgVgP91k"
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

app.use("/", routes);

app.post("/download", (req, res) => {
  upload(req, res, err => {
    fs.readFile(`./uploads/${req.file.originalname}`, (err, data) => {
      if (err) return console.log("This is your error message", err);

      worker
        .recognize(data, "eng", { tessjs_create_pdf: "2" })
        .progress(progress => {
          console.log(progress);
        })

        .then(result => {
          let translationTextResult;
          let text = result.text;

          //invoking google api
          googleTranslate.translate(text, req.body.lang, function(
            err,
            translation
          ) {
            translationTextResult = translation.translatedText;
            //rendering the ejs file
            res.render("download", {
              text: text,
              translationTextResult: translationTextResult,
              pageTitle: "Translated",
              path: "/download"
            });
            //route to the download page

            let path = `${__dirname}/translated.txt`;
            let translationContent = translationTextResult;
            return fs.writeFile(path, translationContent, err => {
              if (err) console.log(err);
              console.log(
                `The file was written with the text: ${translationContent}`
              );
              return translationContent;
            });
          });
        })
        .finally(() => {
          worker.terminate();
        });
    });
  });
});

app.get("/download/translated", (req, res) => {
  const file = `${__dirname}/translated.txt`;
  res.download(file);
});
app.get("/download/original", (req, res) => {
  const file = `${__dirname}/tesseract.js-ocr-result.pdf`;
  res.download(file);
});

//Start up our server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Hey I'm running on port ${PORT}`));
