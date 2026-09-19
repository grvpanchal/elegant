/**
 * Renders a printable completion card from the local progress store.
 * A plan only prints once every one of its steps is marked done.
 */
(function () {
  "use strict";

  function init() {
    var nameInput = document.getElementById("cert-name");
    var planSelect = document.getElementById("cert-plan");
    var printBtn = document.getElementById("cert-print");
    var exportBtn = document.getElementById("cert-export");
    var card = document.getElementById("certificate");
    var note = document.getElementById("cert-note");
    if (!planSelect || !printBtn || !card) return;

    function slugsFor(option) {
      return (option.getAttribute("data-slugs") || "").split(/[\s,]+/).filter(Boolean);
    }

    function say(message) {
      note.textContent = message;
      note.hidden = !message;
    }

    printBtn.addEventListener("click", function () {
      var option = planSelect.options[planSelect.selectedIndex];
      if (!option) return;
      var slugs = slugsFor(option);
      var progress = window.ElegantProgress;
      var ratio = progress ? progress.ratio(slugs) : 0;
      if (ratio < 1) {
        card.hidden = true;
        say("That plan is " + Math.round(ratio * 100) + "% done — finish every step to print it.");
        return;
      }
      say("");
      document.getElementById("cert-out-name").textContent = nameInput.value.trim() || "Anonymous learner";
      document.getElementById("cert-out-plan").textContent = option.textContent.trim();
      document.getElementById("cert-out-score").textContent = slugs.length + " questions completed";
      document.getElementById("cert-out-date").textContent = new Date().toLocaleDateString();
      card.hidden = false;
      window.print();
    });

    if (exportBtn) {
      exportBtn.addEventListener("click", function () {
        var progress = window.ElegantProgress;
        if (!progress) return;
        var blob = new Blob([progress.export()], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "elegant-progress.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
