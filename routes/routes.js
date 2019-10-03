
const express = require("express");

const router = express.Router();

router.get('/', (req,res) => {
    res.render("home");
})

router.get('/about', (req,res) => {
    res.render('about')
})
router.get("/download", (req, res) => {
  res.render("download");
});

router.get('/upload', (req,res) => {
    res.render('upload')
})

module.exports = router;
