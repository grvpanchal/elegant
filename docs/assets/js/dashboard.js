/**
 * The /dashboard/ page: an overview computed in the browser from progress.js.
 *
 * Nothing here is fetched. The page embeds the catalogue (questions, plans,
 * courses, terms) as #dashboard-data, and every number below is that catalogue
 * read against window.ElegantProgress.entries() — the same store every other
 * surface writes. Whoever is signed in (device profile or verified account)
 * decides which store that is; progress-sync.js decides whether it is also in
 * the account, and the identity line says which.
 *
 * Keys: a question slug, a plan's concept-doc ref ("ui/atom"), or a lesson
 * ("lesson:<course>/<slug>"). Values are completion times; a legacy `true`
 * counts as done with no date, so it is in every total but not on the heatmap.
 */
(function () {
  "use strict";

  var DAY = 86400000;
  var WEEKS = 12;
  var LAYERS = ["ui", "server", "state"];
  var LAYER_LABEL = { ui: "UI", server: "Server", state: "State" };
  var FORMATS = ["coding", "ui-coding", "quiz", "system-design", "harness"];
  var FORMAT_LABEL = { coding: "Coding", "ui-coding": "UI coding", quiz: "Quiz", "system-design": "System design", harness: "Agent harness" };
  var DIFFICULTIES = ["easy", "medium", "hard"];
  var DIFF_RANK = { easy: 0, medium: 1, hard: 2 };
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // ------------------------------------------------------------- helpers
  function $(sel) { return document.querySelector(sel); }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (attrs[k] === null || attrs[k] === undefined || attrs[k] === false) return;
      if (k === "text") node.textContent = attrs[k];
      else if (k === "className") node.className = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); }

  function pct(done, total) { return total ? Math.round((done / total) * 100) : 0; }

  function plural(n, one, many) { return n + " " + (n === 1 ? one : (many || one + "s")); }

  function dayKey(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function midnight(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }

  function ago(date) {
    var mins = Math.round((Date.now() - date.getTime()) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return plural(mins, "minute") + " ago";
    var hours = Math.round(mins / 60);
    if (hours < 24) return plural(hours, "hour") + " ago";
    var days = Math.round(hours / 24);
    if (days < 30) return plural(days, "day") + " ago";
    return date.toLocaleDateString();
  }

  function bar(label, done, total, extra) {
    var p = pct(done, total);
    return el("li", { className: "dash-bar" + (total && done === total ? " is-complete" : "") }, [
      el("span", { className: "dash-bar__label", text: label }),
      el("span", { className: "dash-bar__value", text: done + " / " + total }),
      el("span", { className: "dash-bar__rail", "aria-hidden": "true" }, [
        el("span", { className: "dash-bar__fill", style: "width:" + p + "%" }),
      ]),
      extra || null,
    ]);
  }

  // --------------------------------------------------------------- model
  function build(data, entries) {
    var done = {};          // key -> Date | null
    Object.keys(entries).forEach(function (k) {
      var v = entries[k];
      var t = typeof v === "string" ? Date.parse(v) : NaN;
      done[k] = isNaN(t) ? null : new Date(t);
    });
    function isDone(k) { return Object.prototype.hasOwnProperty.call(done, k); }

    var byKey = {};
    data.questions.forEach(function (q) { byKey[q.slug] = { kind: "question", title: q.title, url: q.url, layer: q.layer, q: q }; });
    var lessons = [];
    data.courses.forEach(function (c) {
      c.lessons.forEach(function (l) {
        var entry = { kind: "lesson", title: l.title, url: l.url, course: c, lesson: l };
        byKey[l.key] = entry;
        lessons.push(l);
      });
    });
    data.plans.forEach(function (p) {
      p.items.forEach(function (it) {
        if (!byKey[it.ref]) byKey[it.ref] = { kind: "doc", title: it.title, url: it.url };
      });
    });

    var solved = data.questions.filter(function (q) { return isDone(q.slug); });
    var lessonsDone = lessons.filter(function (l) { return isDone(l.key); });

    // Terminology: a term's linked work is its course lesson(s) plus every bank
    // question tagged with it (topic) or written for its skill. A term with no
    // linked work counts its concept doc, ticked as a reading in a plan.
    var terms = {};
    var termsTotal = 0;
    var termsMastered = 0;
    LAYERS.forEach(function (layer) {
      terms[layer] = (data.terms[layer] || []).map(function (t) {
        var ref = layer + "/" + t.slug;
        var linkedLessons = lessons.filter(function (l) { return l.term === ref; }).map(function (l) { return l.key; });
        var linkedQuestions = data.questions.filter(function (q) {
          return (q.topics || []).indexOf(t.slug) !== -1 || q.skill === layer + "-" + t.slug;
        }).map(function (q) { return q.slug; });
        var items = linkedLessons.concat(linkedQuestions);
        if (!items.length) items = [ref];
        var n = items.filter(isDone).length;
        var state = n === items.length ? "mastered" : (n > 0 || isDone(ref)) ? "started" : "none";
        termsTotal++;
        if (state === "mastered") termsMastered++;
        return { slug: t.slug, title: t.title, url: t.url, state: state, done: n, total: items.length,
                 lessons: linkedLessons.length, questions: linkedQuestions.length };
      });
    });

    // Activity: one count per local calendar day.
    var perDay = {};
    var dated = [];
    var undated = 0;
    Object.keys(done).forEach(function (k) {
      if (done[k]) {
        var key = dayKey(done[k]);
        perDay[key] = (perDay[key] || 0) + 1;
        dated.push({ key: k, at: done[k] });
      } else {
        undated++;
      }
    });
    dated.sort(function (a, b) { return b.at - a.at; });

    return {
      data: data, done: done, isDone: isDone, byKey: byKey,
      solved: solved, lessons: lessons, lessonsDone: lessonsDone,
      terms: terms, termsTotal: termsTotal, termsMastered: termsMastered,
      perDay: perDay, dated: dated, undated: undated,
      total: Object.keys(done).length,
    };
  }

  function streaks(perDay) {
    var today = midnight(new Date());
    // A streak survives until the end of today: start from yesterday if today is empty.
    var cursor = perDay[dayKey(today)] ? today : addDays(today, -1);
    var current = 0;
    while (perDay[dayKey(cursor)]) { current++; cursor = addDays(cursor, -1); }
    var days = Object.keys(perDay).sort();
    var longest = 0, run = 0, prev = null;
    days.forEach(function (k) {
      var parts = k.split("-");
      var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      run = prev && Math.round((d - prev) / DAY) === 1 ? run + 1 : 1;
      if (run > longest) longest = run;
      prev = d;
    });
    return { current: current, longest: longest };
  }

  // ------------------------------------------------------------- sections
  function paintIdentity() {
    var node = $("[data-dash-identity]");
    if (!node) return;
    var data = readData();
    var seam = window.ElegantAccount;
    var sync = window.ElegantProgressSync;
    var who = seam ? seam.current() : null;
    var kind = who ? (seam.providerName() === "local" ? "device" : "account") : "guest";
    var d = sync ? sync.describe() : { synced: false, tone: "info", text: "Progress is saved in this browser only." };
    var state = sync ? sync.status().state : "off";
    var pill = d.synced ? "Synced" : state === "syncing" ? "Syncing" : state === "unavailable" ? "Device only — sync unavailable" : "Device only";
    clear(node);
    node.setAttribute("data-sync", d.synced ? "synced" : state);
    node.appendChild(el("span", { className: "dash-pill dash-pill--" + (d.synced ? "pass" : d.tone), text: pill }));
    if (kind === "account") {
      node.appendChild(document.createTextNode(" Signed in as " + (who.email || who.name) + ". " + d.text + " "));
    } else if (state === "off") {
      node.appendChild(document.createTextNode(" " + d.text + " "));
    } else {
      // Device profile or guest: say where progress is, then the one action that changes it.
      node.appendChild(document.createTextNode(kind === "device"
        ? " Device profile " + who.name + ": progress is saved in this browser only. "
        : " Progress is saved in this browser only. "));
      node.appendChild(el("a", { href: data.links.account, text: kind === "device" ? "Sign in with an email account" : "Sign in" }));
      node.appendChild(document.createTextNode(kind === "device" ? " to carry it to other browsers. " : " to sync it to your account. "));
    }
    node.appendChild(document.createTextNode(" "));
    // No pricing page on the site (`pricing_live` off): no plan to name, nothing to link.
    if (!data.links.pricing) {
      node.appendChild(el("span", { className: "dash-plan" }, ["Everything here is free."]));
      return;
    }
    var receipt = latestReceipt();
    node.appendChild(el("span", { className: "dash-plan" }, [
      receipt ? "Pro (sandbox receipt " + receipt.orderId + ", not yet verified). "
              : "Free plan — everything here is free. ",
      el("a", { href: data.links.pricing, text: receipt ? "Receipt" : "Pricing" }),
    ]));
  }

  function latestReceipt() {
    try {
      var ns = window.ElegantAccount ? window.ElegantAccount.namespace() : "";
      var list = JSON.parse(window.localStorage.getItem("elegant.purchases.v1" + ns) || "[]");
      return Array.isArray(list) && list.length ? list[list.length - 1] : null;
    } catch (err) { return null; }
  }

  function paintStats(m, streak) {
    var set = function (name, value, label) {
      var v = $("[data-stat='" + name + "']");
      if (v) v.textContent = String(value);
      var l = $("[data-stat-label='" + name + "']");
      if (l && label) l.textContent = label;
    };
    set("questions", m.solved.length);
    set("lessons", m.lessonsDone.length, "of " + m.lessons.length + " lessons complete");
    set("terms", m.termsMastered, "of " + m.termsTotal + " terms mastered");
    set("streak", streak.current, "day streak · longest " + streak.longest);
  }

  /** The next undone step after the learner's most recent completion. */
  function nextAfter(m, key) {
    var entry = m.byKey[key];
    if (entry && entry.kind === "lesson") {
      var nextLesson = entry.course.lessons.filter(function (l) { return !m.isDone(l.key); })[0];
      if (nextLesson) return { title: nextLesson.title, url: nextLesson.url, context: entry.course.title };
      var otherCourse = m.data.courses.filter(function (c) {
        return c.lessons.some(function (l) { return !m.isDone(l.key); });
      })[0];
      if (otherCourse) {
        var l = otherCourse.lessons.filter(function (x) { return !m.isDone(x.key); })[0];
        return { title: l.title, url: l.url, context: otherCourse.title };
      }
    }
    var plan = m.data.plans.filter(function (p) {
      return p.items.some(function (i) { return i.ref === key; }) && p.items.some(function (i) { return !m.isDone(i.ref); });
    })[0];
    if (plan) {
      var step = plan.items.filter(function (i) { return !m.isDone(i.ref); })[0];
      return { title: step.title, url: step.url, context: plan.title + " plan" };
    }
    var layer = entry && entry.layer;
    var q = m.data.questions.filter(function (x) { return x.layer === layer && !m.isDone(x.slug); })
      .sort(byEase)[0] || m.data.questions.filter(function (x) { return !m.isDone(x.slug); }).sort(byEase)[0];
    if (q) return { title: q.title, url: q.url, context: LAYER_LABEL[q.layer] + " questions" };
    return null;
  }

  function byEase(a, b) {
    return (DIFF_RANK[a.difficulty] - DIFF_RANK[b.difficulty]) || (a.minutes - b.minutes);
  }

  var emptyContinue = null;
  function paintContinue(m) {
    var box = $("[data-dash-continue]");
    var recent = $("[data-dash-recent]");
    var list = $("[data-dash-recent-list]");
    if (!box) return;
    var last = m.dated[0];
    // The empty state is the page's own markup; keep it to put back when a
    // switch of profile leaves nothing done.
    if (emptyContinue === null) emptyContinue = box.cloneNode(true);
    clear(box);
    if (!last && !m.total) {
      Array.prototype.forEach.call(emptyContinue.childNodes, function (n) { box.appendChild(n.cloneNode(true)); });
      if (recent) recent.hidden = true;
      return;
    }
    var lastKey = last ? last.key : Object.keys(m.done)[0];
    var lastEntry = m.byKey[lastKey] || { title: lastKey };
    box.appendChild(el("p", { className: "dash-card__lede" }, [
      "Last completed: ",
      lastEntry.url ? el("a", { href: lastEntry.url, text: lastEntry.title }) : lastEntry.title,
      last ? " · " + ago(last.at) : "",
    ]));
    var next = nextAfter(m, lastKey);
    if (next) {
      box.appendChild(el("p", { className: "dash-continue__context", text: "Next in " + next.context }));
      box.appendChild(el("a", { className: "course-button", href: next.url, text: "Continue: " + next.title }));
    } else {
      box.appendChild(el("p", { className: "dash-empty", text: "You have finished everything there is. New questions and courses land here first." }));
    }
    if (recent && list) {
      clear(list);
      m.dated.slice(0, 5).forEach(function (d) {
        var e = m.byKey[d.key] || { title: d.key };
        list.appendChild(el("li", null, [
          e.url ? el("a", { href: e.url, text: e.title }) : e.title,
          el("span", { className: "dash-recent__when", text: " · " + ago(d.at) }),
        ]));
      });
      recent.hidden = m.dated.length === 0;
    }
  }

  function paintRecommend(m) {
    var why = $("[data-dash-recommend-why]");
    var list = $("[data-dash-recommend]");
    if (!list) return;
    clear(list);
    var stats = LAYERS.map(function (layer) {
      var all = m.data.questions.filter(function (q) { return q.layer === layer; });
      var done = all.filter(function (q) { return m.isDone(q.slug); }).length;
      return { layer: layer, all: all, done: done, ratio: all.length ? done / all.length : 1 };
    });
    var open = stats.filter(function (s) { return s.done < s.all.length; });
    if (!open.length) {
      if (why) why.textContent = "You have solved every question in the bank. Write one: every question is one file.";
      return;
    }
    open.sort(function (a, b) { return (a.ratio - b.ratio) || (a.done - b.done); });
    var weakest = open[0];
    var picks = weakest.all.filter(function (q) { return !m.isDone(q.slug); }).sort(byEase).slice(0, 3);
    if (why) {
      why.textContent = m.solved.length
        ? "Your weakest layer is " + LAYER_LABEL[weakest.layer] + " — " + weakest.done + " of " + weakest.all.length +
          " solved. Its unsolved questions, easiest first:"
        : "Nothing solved yet, so start with the quickest questions in the " + LAYER_LABEL[weakest.layer] + " layer:";
    }
    picks.forEach(function (q) {
      list.appendChild(el("li", { className: "dash-reco__item" }, [
        el("a", { className: "dash-reco__link", href: q.url, text: q.title }),
        el("span", { className: "dash-reco__meta" }, [
          el("span", { className: "tag tag--" + q.format, text: FORMAT_LABEL[q.format] || q.format }),
          " ",
          el("span", { className: "tag tag--" + q.difficulty, text: q.difficulty }),
          " ",
          el("span", { className: "tag", text: q.minutes + " min" }),
        ]),
      ]));
    });
  }

  function paintHeatmap(m, streak) {
    var grid = $("[data-heat-grid]");
    var months = $("[data-heat-months]");
    var wrap = $("[data-heat]");
    var summary = $("[data-heat-summary]");
    var table = $("[data-heat-table]");
    var tableWrap = $("[data-heat-table-wrap]");
    if (!grid) return;
    clear(grid); clear(months); clear(table);

    var today = midnight(new Date());
    // Columns are weeks starting Monday; the last column is this week.
    var offset = (today.getDay() + 6) % 7;           // days since Monday
    var start = addDays(today, -offset - (WEEKS - 1) * 7);
    var total = 0, active = 0, lastMonth = -1;
    var rows = [];
    for (var w = 0; w < WEEKS; w++) {
      var monday = addDays(start, w * 7);
      var label = "";
      // Label a column with its month when the month starts in it (or for the first column).
      for (var i = 0; i < 7; i++) {
        var probe = addDays(monday, i);
        if (probe.getMonth() !== lastMonth && (w === 0 || probe.getDate() <= 7)) {
          label = MONTHS[probe.getMonth()];
          lastMonth = probe.getMonth();
          break;
        }
      }
      months.appendChild(el("span", { text: label }));
      for (var d = 0; d < 7; d++) {
        var day = addDays(monday, d);
        if (day > today) {
          grid.appendChild(el("span", { className: "heat-cell heat-cell--future" }));
          continue;
        }
        var n = m.perDay[dayKey(day)] || 0;
        total += n;
        if (n) active++;
        var level = n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n <= 4 ? 3 : 4;
        var text = WEEKDAYS[day.getDay()] + " " + day.getDate() + " " + MONTHS[day.getMonth()] + ": " +
          (n ? plural(n, "completion") : "nothing completed");
        grid.appendChild(el("span", { className: "heat-cell" + (dayKey(day) === dayKey(today) ? " is-today" : ""),
          "data-level": String(level), title: text }));
        if (n) rows.push({ day: day, n: n });
      }
    }

    var line = total
      ? plural(total, "completion") + " on " + plural(active, "day") + " in the last 12 weeks. Current streak " +
        plural(streak.current, "day") + ", longest " + plural(streak.longest, "day") + "."
      : "No activity in the last 12 weeks yet — your next completion lights up today's square.";
    if (m.undated) line += " " + plural(m.undated, "older completion") + " " + (m.undated === 1 ? "has" : "have") + " no date and " + (m.undated === 1 ? "is" : "are") + " not shown.";
    if (summary) summary.textContent = line;
    if (wrap) wrap.setAttribute("aria-label", "Activity heatmap. " + line + " The same days are listed in the table below.");

    rows.reverse().forEach(function (r) {
      table.appendChild(el("tr", null, [
        el("td", { text: r.day.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" }) }),
        el("td", { text: String(r.n) }),
      ]));
    });
    if (tableWrap) tableWrap.hidden = rows.length === 0;
  }

  function paintBreakdown(m) {
    var groups = {
      layer: LAYERS.map(function (k) { return { key: k, label: LAYER_LABEL[k] }; }),
      format: FORMATS.map(function (k) { return { key: k, label: FORMAT_LABEL[k] }; }),
      difficulty: DIFFICULTIES.map(function (k) { return { key: k, label: k.charAt(0).toUpperCase() + k.slice(1) }; }),
    };
    Object.keys(groups).forEach(function (facet) {
      var list = $("[data-dash-bars='" + facet + "']");
      if (!list) return;
      clear(list);
      groups[facet].forEach(function (g) {
        var all = m.data.questions.filter(function (q) { return q[facet] === g.key; });
        if (!all.length) return;
        var done = all.filter(function (q) { return m.isDone(q.slug); }).length;
        list.appendChild(bar(g.label, done, all.length));
      });
    });
  }

  function row(title, url, done, total, unit, action) {
    var p = pct(done, total);
    return el("li", { className: "dash-row" + (total && done === total ? " is-complete" : "") }, [
      el("div", { className: "dash-row__head" }, [
        el("a", { className: "dash-row__title", href: url, text: title }),
        el("span", { className: "dash-row__count", text: done + " of " + plural(total, unit) + " · " + p + "%" }),
      ]),
      el("span", { className: "dash-bar__rail", "aria-hidden": "true" }, [
        el("span", { className: "dash-bar__fill", style: "width:" + p + "%" }),
      ]),
      action,
    ]);
  }

  function paintCourses(m) {
    var list = $("[data-dash-courses]");
    if (!list) return;
    clear(list);
    m.data.courses.forEach(function (c) {
      var done = c.lessons.filter(function (l) { return m.isDone(l.key); }).length;
      var next = c.lessons.filter(function (l) { return !m.isDone(l.key); })[0];
      var label = !done ? "Start course" : next ? "Continue: " + next.title : "Complete — review";
      var href = next ? next.url : (c.lessons[0] ? c.lessons[0].url : c.url);
      list.appendChild(row(c.title, c.url, done, c.lessons.length, "lesson",
        el("a", { className: "course-button course-button--small", href: href, text: label })));
    });
  }

  function paintPlans(m) {
    var list = $("[data-dash-plans]");
    if (!list) return;
    clear(list);
    m.data.plans.forEach(function (p) {
      var done = p.items.filter(function (i) { return m.isDone(i.ref); }).length;
      var next = p.items.filter(function (i) { return !m.isDone(i.ref); })[0];
      var action = next
        ? el("a", { className: "course-button course-button--small", href: next.url, text: (done ? "Continue: " : "Start: ") + next.title })
        : el("a", { className: "course-button course-button--small", href: p.url, text: "Plan complete — print the certificate" });
      list.appendChild(row(p.title, p.url, done, p.items.length, "step", action));
    });
  }

  function paintTerms(m) {
    var box = $("[data-dash-terms]");
    if (!box) return;
    clear(box);
    LAYERS.forEach(function (layer) {
      var terms = m.terms[layer];
      var mastered = terms.filter(function (t) { return t.state === "mastered"; }).length;
      var started = terms.filter(function (t) { return t.state === "started"; }).length;
      var list = el("ul", { className: "term-chips" });
      terms.forEach(function (t) {
        var detail = t.title + ": " + t.done + " of " + t.total + " linked " + (t.total === 1 ? "item" : "items") + " done";
        list.appendChild(el("li", null, [
          el("a", { className: "term-chip term-chip--" + t.state, href: t.url, title: detail }, [
            el("span", { className: "term-chip__name", text: t.title }),
            t.state !== "none" ? el("span", { className: "term-chip__state", text: t.state === "mastered" ? "mastered" : "started" }) : null,
            el("span", { className: "sr-only", text: " — " + t.done + " of " + t.total + " done" }),
          ]),
        ]));
      });
      box.appendChild(el("div", { className: "dash-terms__layer" }, [
        el("h3", { className: "dash-terms__title" }, [
          LAYER_LABEL[layer],
          el("span", { className: "dash-terms__count", text: mastered + " of " + terms.length + " mastered · " + started + " started" }),
        ]),
        el("span", { className: "dash-bar__rail", "aria-hidden": "true" }, [
          el("span", { className: "dash-bar__fill", style: "width:" + pct(mastered, terms.length) + "%" }),
        ]),
        list,
      ]));
    });
  }

  // ---------------------------------------------------------------- wiring
  var cached = null;
  function readData() {
    if (cached) return cached;
    var node = document.getElementById("dashboard-data");
    try { cached = JSON.parse(node ? node.textContent : "{}"); }
    catch (err) { cached = { questions: [], plans: [], courses: [], terms: {}, links: {} }; }
    cached.questions = cached.questions || [];
    cached.plans = cached.plans || [];
    cached.courses = cached.courses || [];
    cached.terms = cached.terms || {};
    cached.links = cached.links || {};
    return cached;
  }

  function paint() {
    var progress = window.ElegantProgress;
    if (!progress) return;
    var m = build(readData(), progress.entries());
    var streak = streaks(m.perDay);
    paintIdentity();
    paintStats(m, streak);
    paintContinue(m);
    paintRecommend(m);
    paintHeatmap(m, streak);
    paintBreakdown(m);
    paintCourses(m);
    paintPlans(m);
    paintTerms(m);
  }

  function init() {
    if (!document.getElementById("dashboard-data")) return;
    document.addEventListener("progress:changed", paint);
    document.addEventListener("account:changed", paint);
    document.addEventListener("progress:sync", paintIdentity);
    paint();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
