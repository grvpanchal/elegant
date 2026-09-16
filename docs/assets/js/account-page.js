/**
 * The /account/ page: export, import and the profile list.
 * Everything here goes through window.ElegantAccount; this file is only UI.
 */
(function () {
  "use strict";

  function init() {
    var account = window.ElegantAccount;
    if (!account) return;
    var status = document.getElementById("account-status");
    var list = document.getElementById("account-list");
    var exportBtn = document.getElementById("account-export");
    var importInput = document.getElementById("account-import");

    function say(message, tone) {
      if (!status) return;
      status.textContent = message || "";
      status.className = "account-transfer__status" + (tone ? " is-" + tone : "");
    }

    function renderList() {
      if (!list) return;
      var profiles = account.list();
      var current = account.current();
      list.innerHTML = "";
      if (!profiles.length) {
        var empty = document.createElement("li");
        empty.className = "account-list__empty";
        empty.textContent = "No profiles yet — sign in above to make one.";
        list.appendChild(empty);
        return;
      }
      profiles.forEach(function (profile) {
        var item = document.createElement("li");
        item.className = "account-list__item";
        item.setAttribute("data-profile", profile.id);
        if (current && current.id === profile.id) item.classList.add("is-current");

        var name = document.createElement("span");
        name.className = "account-list__name";
        name.textContent = profile.name + (current && current.id === profile.id ? " (signed in)" : "");
        item.appendChild(name);

        var use = document.createElement("button");
        use.type = "button";
        use.className = "account-list__use";
        use.textContent = "Switch to";
        use.addEventListener("click", function () { account.signIn(profile.name); });
        item.appendChild(use);

        var remove = document.createElement("button");
        remove.type = "button";
        remove.className = "account-list__remove";
        remove.setAttribute("data-profile-remove", profile.id);
        remove.textContent = "Delete";
        remove.addEventListener("click", function () {
          if (window.confirm("Delete " + profile.name + " and its progress from this browser?")) {
            account.remove(profile.id);
          }
        });
        item.appendChild(remove);

        list.appendChild(item);
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener("click", function () {
        if (!account.current()) { say("Sign in first — there is no profile to export.", "fail"); return; }
        var blob = new Blob([account.export()], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "elegant-profile-" + account.current().id + ".json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        say("Exported. Import that file in the other browser.", "pass");
      });
    }

    if (importInput) {
      importInput.addEventListener("change", function () {
        var file = importInput.files && importInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var profile = account.import(String(reader.result));
            say("Imported " + profile.name + " — you are signed in as that profile.", "pass");
          } catch (err) {
            say(err.message, "fail");
          }
          importInput.value = "";
        };
        reader.onerror = function () { say("Could not read that file.", "fail"); };
        reader.readAsText(file);
      });
    }

    document.addEventListener("account:changed", renderList);
    renderList();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
