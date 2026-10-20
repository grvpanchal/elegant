/**
 * PayPal SANDBOX checkout for /pricing/.
 *
 * The PayPal JS SDK is loaded only when a paid tier is chosen, so the page
 * costs nothing for the people who stay on Free. The order is created in the
 * browser (actions.order.create) and captured on approval
 * (actions.order.capture); the receipt — PayPal's order id, capture id and
 * status — is kept in localStorage under the account namespace, so a learner
 * signed in on this browser sees their own receipts and nobody else's.
 *
 * What this deliberately does NOT do: decide that someone has paid. A browser
 * cannot verify a payment to itself, and this site has no server and no PayPal
 * secret — and must never get one. Verifying captures against PayPal is done
 * server-side by the CFO office, and nothing on the site is locked behind it.
 *
 * Refuses to run unless the configured environment is "sandbox".
 */
(function () {
  "use strict";

  var STORE = "elegant.purchases.v1";
  var SDK = "https://www.paypal.com/sdk/js";

  function $(sel) { return document.querySelector(sel); }

  function config() {
    try { return JSON.parse(($("#pricing-data") || {}).textContent || "{}"); }
    catch (err) { return {}; }
  }

  function storeKey() {
    var ns = "";
    try { ns = window.ElegantAccount ? window.ElegantAccount.namespace() : ""; } catch (err) { ns = ""; }
    return STORE + ns;
  }

  function receipts() {
    try {
      var list = JSON.parse(window.localStorage.getItem(storeKey()) || "[]");
      return Array.isArray(list) ? list : [];
    } catch (err) { return []; }
  }

  function keep(receipt) {
    var list = receipts();
    list.push(receipt);
    try { window.localStorage.setItem(storeKey(), JSON.stringify(list)); return true; }
    catch (err) { return false; }
  }

  function init() {
    var cfg = config();
    var paypal = cfg.paypal || {};
    var tiers = {};
    (cfg.tiers || []).forEach(function (t) { tiers[t.slug] = t; });

    var panel = $("[data-checkout-panel]");
    var status = $("[data-checkout-status]");
    var mount = $("[data-paypal-buttons]");
    var receiptBox = $("[data-receipt]");
    var current = null;
    var sdkPromise = null;
    var rendered = false;

    function say(text, tone) {
      if (!status) return;
      status.textContent = text || "";
      status.setAttribute("data-tone", tone || "info");
    }

    function loadSdk() {
      if (window.paypal && window.paypal.Buttons) return Promise.resolve(window.paypal);
      if (sdkPromise) return sdkPromise;
      sdkPromise = new Promise(function (resolve, reject) {
        var s = document.createElement("script");
        s.src = SDK + "?client-id=" + encodeURIComponent(paypal.clientId) +
          "&currency=" + encodeURIComponent(paypal.currency || "USD") +
          "&intent=capture&components=buttons";
        s.async = true;
        s.setAttribute("data-namespace", "paypal");
        s.onload = function () {
          if (window.paypal && window.paypal.Buttons) resolve(window.paypal);
          else reject(new Error("PayPal loaded without its buttons."));
        };
        s.onerror = function () {
          sdkPromise = null;
          reject(new Error("Could not load PayPal. Check your connection or an ad blocker, then try again."));
        };
        document.head.appendChild(s);
      });
      return sdkPromise;
    }

    function payerName(details) {
      var p = details && details.payer && details.payer.name;
      if (!p) return "PayPal sandbox buyer";
      return [p.given_name, p.surname].filter(Boolean).join(" ") || "PayPal sandbox buyer";
    }

    function showReceipt(r) {
      if (!receiptBox) return;
      var set = function (sel, text) { var n = $(sel); if (n) n.textContent = text; };
      set("[data-receipt-order]", r.orderId);
      set("[data-receipt-status]", r.status + " (sandbox, not yet verified by the CFO office)");
      set("[data-receipt-tier]", r.tierName + " — " + r.billing);
      set("[data-receipt-amount]", r.amount + " " + r.currency);
      set("[data-receipt-capture]", r.captureId || "—");
      set("[data-receipt-payer]", r.payer);
      set("[data-receipt-when]", new Date(r.capturedAt).toLocaleString());
      receiptBox.hidden = false;
      var title = $("#receipt-title");
      if (title) title.focus();
    }

    function paintReceipts() {
      var box = $("[data-receipts]");
      var list = $("[data-receipts-list]");
      if (!box || !list) return;
      while (list.firstChild) list.removeChild(list.firstChild);
      var all = receipts();
      all.slice().reverse().forEach(function (r) {
        var li = document.createElement("li");
        var code = document.createElement("code");
        code.textContent = r.orderId;
        li.appendChild(document.createTextNode(r.tierName + " · " + r.amount + " " + r.currency + " · "));
        li.appendChild(code);
        li.appendChild(document.createTextNode(" · " + new Date(r.capturedAt).toLocaleDateString() + " · " + r.status + ", not yet verified"));
        list.appendChild(li);
      });
      box.hidden = all.length === 0;
    }

    function render(sdk) {
      if (rendered) return Promise.resolve();
      rendered = true;
      return sdk.Buttons({
        style: { layout: "vertical", shape: "rect", label: "paypal" },
        createOrder: function (data, actions) {
          var tier = current;
          var who = window.ElegantAccount && window.ElegantAccount.providerName() === "supabase"
            ? window.ElegantAccount.current() : null;
          var unit = {
            reference_id: tier.slug,
            description: "Elegant " + tier.name + " (" + tier.billing + ") — sandbox test order",
            amount: { currency_code: paypal.currency || "USD", value: String(tier.amount) },
          };
          // A verified account id lets the CFO office match the order to a
          // learner. A device profile's id is just a typed name, so it is not sent.
          if (who && who.id) unit.custom_id = String(who.id).slice(0, 127);
          say("Waiting for PayPal…");
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [unit],
            application_context: { shipping_preference: "NO_SHIPPING", brand_name: "Elegant", user_action: "PAY_NOW" },
          });
        },
        onApprove: function (data, actions) {
          say("Approved — capturing the payment…");
          return actions.order.capture().then(function (details) {
            var unit = (details.purchase_units || [])[0] || {};
            var capture = ((unit.payments || {}).captures || [])[0] || {};
            var tier = current;
            var r = {
              orderId: details.id || data.orderID,
              status: details.status || capture.status || "COMPLETED",
              tier: tier.slug,
              tierName: tier.name,
              billing: tier.billing,
              amount: (capture.amount && capture.amount.value) || String(tier.amount),
              currency: (capture.amount && capture.amount.currency_code) || paypal.currency || "USD",
              captureId: capture.id || null,
              payer: payerName(details),
              capturedAt: new Date().toISOString(),
              env: "sandbox",
              verified: false,
            };
            var saved = keep(r);
            say(saved ? "Payment captured in the sandbox. Your receipt is below." :
              "Payment captured in the sandbox, but this browser would not save the receipt — note the order ID below.", "pass");
            if (panel) panel.hidden = true;
            showReceipt(r);
            paintReceipts();
          });
        },
        onCancel: function () {
          say("Checkout cancelled. Nothing was charged — the Free tier is still everything.", "info");
        },
        onError: function (err) {
          say("PayPal could not complete the order" + (err && err.message ? ": " + err.message : ".") +
            " Nothing was charged. Try again, or pick a different tier.", "fail");
        },
      }).render(mount).then(function () {
        say("Pay with a PayPal sandbox test account. No real money moves.");
      });
    }

    function open(slug) {
      var tier = tiers[slug];
      if (!tier || !panel) return;
      current = tier;
      var set = function (sel, text) { var n = $(sel); if (n) n.textContent = text; };
      set("[data-checkout-name]", tier.name);
      set("[data-checkout-tier]", tier.name + " — " + tier.billing);
      set("[data-checkout-amount]", "$" + tier.amount + " " + (paypal.currency || "USD") + " (test money, not the price)");
      panel.hidden = false;
      if (receiptBox) receiptBox.hidden = true;
      var title = $("#checkout-title");
      if (title) title.focus();

      if (paypal.env !== "sandbox") {
        say("Live checkout is not enabled on this site. Only the PayPal sandbox is.", "fail");
        return;
      }
      if (!paypal.clientId) {
        say("Checkout is not configured on this deployment.", "fail");
        return;
      }
      say(rendered ? "Pay with a PayPal sandbox test account. No real money moves." : "Loading PayPal…");
      loadSdk().then(render).catch(function (err) {
        rendered = false;
        say(err.message, "fail");
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll("[data-checkout]"), function (btn) {
      btn.addEventListener("click", function () { open(btn.getAttribute("data-checkout")); });
    });

    var cancel = $("[data-checkout-cancel]");
    if (cancel) {
      cancel.addEventListener("click", function () {
        if (panel) panel.hidden = true;
        var back = current && document.querySelector("[data-checkout='" + current.slug + "']");
        if (back) back.focus();
      });
    }

    paintReceipts();
    document.addEventListener("account:changed", paintReceipts);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
