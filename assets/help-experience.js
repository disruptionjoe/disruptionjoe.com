(function () {
  "use strict";
  var sections = Array.from(document.querySelectorAll(".help-screen"));
  sections.forEach(function (section, index) {
    if (!sections[index + 1]) return;
    var button = document.createElement("button");
    button.className = "help-next";
    button.type = "button";
    button.textContent = "Continue ↓";
    button.addEventListener("click", function () {
      sections[index + 1].scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    section.querySelector(".section-inner").appendChild(button);
  });
}());
