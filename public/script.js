

var loader = document.getElementById("loading");
var convertBtn = document.getElementById("convert-btn");
loader.classList.add("loader");

convertBtn.addEventListener("click", function() {
  loader.innerHTML = "Loading";
  setTimeout(function() {
      loader.innerHTML = ""
  }, 3000)
});

