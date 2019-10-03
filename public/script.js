const formSubmit = document.getElementById("convert-btn");
const downloadBtn = document.getElementById("downloadBtn");

const langSelectOptions = document.getElementById("lang");

downloadBtn.addEventListener("click", e => {
   console.log(e.target);
});

langSelectOptions.addEventListener("click", e => {
  let selectedLang = e.target.value;
  console.log(selectedLang);
  return selectedLang;
});
