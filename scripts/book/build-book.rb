#!/usr/bin/env ruby
# Assemble "The Elegant Frontend" book as one print-ready HTML file.
#
# Three parts (UI, Server, State), one chapter per term in the order of
# docs/_data/topics/<layer>.csv. Each chapter joins the term's doc
# (docs/<layer>/<slug>.md: summary, key insight, description, the first code
# example, common mistakes) with the best practices from its Agent Skill
# (skills/<layer>-<slug>/SKILL.md: key principles, do/don't, quality gates).
#
#   ruby scripts/book/build-book.rb <out.html> [toc-pages.json]
#
# print-book.mjs renders the HTML to PDF and calls this twice: the second run
# receives the page each chapter landed on, so the contents page can show it.

Encoding.default_external = Encoding::UTF_8
Encoding.default_internal = Encoding::UTF_8

require "csv"
require "json"
require "kramdown"
require "kramdown-parser-gfm"
require "rouge"
require "cgi"
require "yaml"

ROOT = File.expand_path("../..", __dir__)
DOCS = File.join(ROOT, "docs")
SITE = "https://elegantfrontend.training"

PARTS = [
  { layer: "ui", title: "The UI Side", numeral: "I",
    intro: "Everything the user sees and touches. The UI side starts at a single " \
           "element, climbs through atomic design (atoms, molecules, organisms, " \
           "templates) and ends with the cross-cutting concerns every component owes " \
           "its users: theming, responsive layout and accessibility." },
  { layer: "server", title: "The Server Side", numeral: "II",
    intro: "Everything that happens before and around the first paint. The server " \
           "side covers how a page is shipped (app shell, SSR, SSG, micro-frontends), " \
           "how it is found and navigated (router, links, SEO) and how it talks to the " \
           "world (APIs, sessions, auth, forms, PWA)." },
  { layer: "state", title: "The State Side", numeral: "III",
    intro: "Everything the application remembers. The state side follows data through " \
           "a predictable loop: a store holds it, actions describe change, reducers " \
           "apply it, selectors read it, and middleware handles the side effects in " \
           "between." },
].freeze

# Optional page map from the first print pass: { "ch-ui-atom" => 7, ... }
PAGE_MAP = ARGV[1] && File.exist?(ARGV[1]) ? JSON.parse(File.read(ARGV[1])) : {}

def strip_front_matter(src)
  src.sub(/\A---\s*\n.*?\n---\s*\n/m, "")
end

# Split markdown into [preamble, {heading => body}] on level-2 headings,
# ignoring headings inside fenced code blocks.
def split_sections(src)
  pre = +""
  sections = []
  fence = nil
  src.each_line do |line|
    if (m = line.match(/^\s*(```+|~~~+)/))
      fence = fence.nil? ? m[1][0, 3] : (line.strip.start_with?(fence) ? nil : fence)
    end
    if fence.nil? && !line.start_with?("###") && line =~ /^##\s+(.+?)\s*$/
      sections << [$1.strip, +""]
    elsif sections.empty?
      pre << line
    else
      sections.last[1] << line
    end
  end
  [pre, sections]
end

def section(sections, *names)
  names.each do |n|
    hit = sections.find { |h, _| h.downcase.sub(/[^a-z ]/, "").strip == n.downcase }
    return hit[1] if hit
  end
  nil
end

# Keep only the first framework of a code-tabs block; the rest live online.
def first_tab_only(md, url)
  md.gsub(%r{\{::nomarkdown\}<div class="code-tabs">\{:/\}\s*\n(.*?)\{::nomarkdown\}</div>\{:/\}}m) do
    body = $1
    label = body[/\A\s*([^\n`]+?)\s*\n/, 1]
    fence = body[/^```.*?^```/m]
    others = body.scan(/^([A-Z][\w ]+)\s*\n```/).flatten.map(&:strip) - [label]
    note = others.empty? ? "" : "\n\n*#{label} shown; the #{others.join(', ')} versions are on [the site](#{url}).*\n"
    "\n**#{label}**\n\n#{fence}\n#{note}\n"
  end
end

# The first ### example under "Code Examples" (or the whole section when it
# has no sub-headings).
def first_example(body)
  return nil unless body
  parts = body.split(/^(?=### )/)
  intro = parts.first.start_with?("### ") ? "" : parts.shift
  pick = parts.first || intro
  (parts.empty? ? pick : intro + pick).sub(/^### /, "### Example: ").sub("Example: Basic Example: ", "Example: ")
end

def demote(md)
  md.gsub(/^(#+)(\s)/) { "#{$1}##{$2}" }
end

def clean_liquid(md)
  md.gsub(/\{%.*?%\}/m, "").gsub(/\{\{.*?\}\}/m, "")
end

# Rewrite doc links: other terms become in-book anchors, everything else an
# absolute URL on the site; images become file URLs Chromium can load.
def rewrite_links(md, layer, known)
  md = md.gsub(/!\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/) do
    alt, src = $1, $2
    path = src.start_with?("/") ? File.join(DOCS, src) : File.expand_path(src, File.join(DOCS, layer))
    File.exist?(path) ? "![#{alt}](file://#{path})" : ""
  end
  md.gsub(/(?<!!)\[([^\]]+)\]\(([^)\s]+)\)/) do
    text, href = $1, $2
    next "[#{text}](#{href})" if href =~ /\A(https?:|mailto:|#)/
    path = href.sub(/#.*/, "").sub(/\.(html|md)\z/, "")
    abs = path.start_with?("/") ? path : File.expand_path(path, "/#{layer}/")
    key = abs.sub(%r{\A/}, "").sub(%r{/\z}, "")
    if known.include?(key)
      "[#{text}](#ch-#{key.tr('/', '-')})"
    else
      "[#{text}](#{SITE}#{abs})"
    end
  end
end

def render(md)
  Kramdown::Document.new(
    md,
    input: "GFM", hard_wrap: false, syntax_highlighter: "rouge",
    syntax_highlighter_opts: { css_class: "highlight", default_lang: "plaintext" },
    auto_ids: false, smart_quotes: %w[lsquo rsquo ldquo rdquo]
  ).to_html
end

def esc(s) = CGI.escapeHTML(s.to_s)

parts = PARTS.map do |p|
  rows = CSV.read(File.join(DOCS, "_data/topics/#{p[:layer]}.csv"), headers: true)
  p.merge(terms: rows.map { |r| { title: r["title"].strip, slug: r["slug"].strip } })
end
known = parts.flat_map { |p| p[:terms].map { |t| "#{p[:layer]}/#{t[:slug]}" } }

chapter_no = 0
body = +""
toc = +""
missing = []

parts.each do |part|
  pid = "part-#{part[:layer]}"
  toc << %(<li class="toc-part"><a href="##{pid}"><span class="toc-title">Part #{part[:numeral]} &middot; #{esc part[:title]}</span>) +
         %(<span class="toc-page">#{PAGE_MAP[pid]}</span></a><ol>)
  icons = part[:terms].map do |t|
    logo = "docs/assets/img/logos/#{t[:slug]}.svg"
    img = File.exist?(File.join(ROOT, logo)) ? %(<span class="icon-box"><img src="file://#{File.join(ROOT, logo)}" alt=""></span>) : ""
    %(<li><a href="#ch-#{part[:layer]}-#{t[:slug]}">#{img}<span class="icon-label">#{esc t[:title]}</span></a></li>)
  end.join
  body << <<~HTML
    <section class="part" id="#{pid}">
      <p class="part__eyebrow">Part #{part[:numeral]}</p>
      <h1 class="part__title">#{esc part[:title]}</h1>
      <p class="part__intro">#{esc part[:intro]}</p>
      <ul class="part__terms">#{icons}</ul>
    </section>
  HTML

  part[:terms].each do |term|
    chapter_no += 1
    key = "#{part[:layer]}/#{term[:slug]}"
    cid = "ch-#{part[:layer]}-#{term[:slug]}"
    url = "#{SITE}/#{key}.html"
    doc_path = File.join(DOCS, "#{key}.md")
    skill_path = File.join(ROOT, "skills/#{part[:layer]}-#{term[:slug]}/SKILL.md")
    unless File.exist?(doc_path)
      missing << doc_path
      next
    end

    pre, secs = split_sections(strip_front_matter(File.read(doc_path)))
    summary = pre.lines.select { |l| l.start_with?(">") }.join
    md = +""
    md << "<div class=\"chapter__summary\" markdown=\"1\">\n#{summary.gsub(/^>\s?/, '')}\n</div>\n\n" unless summary.strip.empty?
    if (ki = section(secs, "Key Insight"))
      md << "<div class=\"key-insight\" markdown=\"1\">\n**Key insight.** #{ki.strip}\n</div>\n\n"
    end
    if (dd = section(secs, "Detailed Description"))
      md << "## What it is\n\n#{demote(dd.strip).gsub(/^## /, '### ')}\n\n"
    end
    if (ex = first_example(section(secs, "Code Examples", "Basic Example")))
      md << "## In code\n\n#{first_tab_only(ex.strip, url)}\n\n"
    end
    if (cm = section(secs, "Common Mistakes"))
      md << "## Common mistakes\n\n#{cm.strip}\n\n"
    end

    if File.exist?(skill_path)
      _, ssecs = split_sections(strip_front_matter(File.read(skill_path)))
      bp = +""
      if (kp = section(ssecs, "Key Principles"))
        bp << "### Key principles\n\n#{kp.strip}\n\n"
      end
      if (b = section(ssecs, "Best Practices"))
        dos = b[/✅[^\n]*\n(.*?)(?=❌|\z)/m, 1].to_s.strip
        donts = b[/❌[^\n]*\n(.*)/m, 1].to_s.strip
        if dos.empty? && donts.empty?
          bp << "#{b.strip}\n\n"
        else
          bp << "<div class=\"dodont\" markdown=\"1\">\n<div class=\"dodont__do\" markdown=\"1\">\n**Do**\n\n#{dos}\n</div>\n" \
                "<div class=\"dodont__dont\" markdown=\"1\">\n**Don't**\n\n#{donts}\n</div>\n</div>\n\n"
        end
      end
      if (qg = section(ssecs, "Quality Gates"))
        gates = qg.lines.grep(/^\s*-\s*\[ \]/).map { |l| l.sub(/^\s*-\s*\[ \]\s*/, "- ") }.join
        bp << "### Quality gates\n\nBefore you call it done:\n\n<div class=\"gates\" markdown=\"1\">\n#{gates}\n</div>\n\n" unless gates.empty?
      end
      md << "## Best practices\n\n#{bp}" unless bp.empty?
    else
      missing << skill_path
    end

    md = rewrite_links(clean_liquid(md), part[:layer], known)
    # Chapter headings start at h2 in the doc; keep them there.
    html = render(md)
    logo = File.join(ROOT, "docs/assets/img/logos/#{term[:slug]}.svg")
    logo_tag = File.exist?(logo) ? %(<img class="chapter__logo" src="file://#{logo}" alt="">) : ""
    body << <<~HTML
      <article class="chapter" id="#{cid}" data-layer="#{part[:layer]}">
        <header class="chapter__head">
          #{logo_tag}
          <h1 class="chapter__title">#{esc term[:title]}</h1>
          <p class="chapter__eyebrow">#{esc part[:title]} &middot; Chapter #{chapter_no}</p>
        </header>
        #{html}
        <p class="chapter__more">Practise this term, with all four framework versions and a quiz: <a href="#{url}">#{url.sub('https://', '')}</a></p>
      </article>
    HTML
    toc_icon = File.exist?(logo) ? %(<span class="icon-box icon-box--xs"><img src="file://#{logo}" alt=""></span>) : ""
    toc << %(<li><a href="##{cid}">#{toc_icon}<span class="toc-title">#{chapter_no}. #{esc term[:title]}</span><span class="toc-page">#{PAGE_MAP[cid]}</span></a></li>)
  end
  toc << "</ol></li>"
end

warn "build-book: missing sources:\n  #{missing.join("\n  ")}" unless missing.empty?

css = File.read(File.join(__dir__, "book.css")) + Rouge::Themes::Github.render(scope: ".highlight")
built = Time.now.utc.strftime("%B %Y")


AUTHOR = YAML.safe_load(File.read(File.join(DOCS, "_config.yml"))).dig("author", "name") || "elegant"

def file_url(rel) = "file://#{File.join(DOCS, rel)}"

# The cover redraws the home page's "Why three layers" figures as one object:
# the enterprise figure's stacked-layers icon, exploded into the three sides it
# names (UI on top, the server beneath it, state at the base), each in that
# figure's colour and carrying its own term icon on its top face.
SIDES = [
  { layer: "ui", word: "UI", logo: "organism", note: "what people see",
    top: "#e3f0fe", left: "#5aa9f5", right: "#3d8fe0", ink: "#2f7fd0" },
  { layer: "server", word: "Server", logo: "container", note: "what delivers it",
    top: "#dcf6e9", left: "#22c27a", right: "#17a463", ink: "#139457" },
  { layer: "state", word: "State", logo: "store", note: "what remembers it",
    top: "#ffe4e2", left: "#ff6b63", right: "#e9504a", ink: "#d8433d" },
].freeze

def iso_stack(parts)
  w, h, t = 46.0, 26.5, 10.0
  # Each layer steps down and to the right, so every face shows in full.
  centres = [[50.0, 34.0], [80.0, 84.0], [110.0, 134.0]] # UI, Server, State
  pt = ->(x, y) { "#{x.round(2)},#{y.round(2)}" }
  svg = +%(<svg class="cover__stack" viewBox="0 0 222 176" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">)
  SIDES.each_with_index.to_a.reverse_each do |side, i|
    cx, cy = centres[i]
    top = [pt[cx, cy - h], pt[cx + w, cy], pt[cx, cy + h], pt[cx - w, cy]].join(" ")
    left = [pt[cx - w, cy], pt[cx, cy + h], pt[cx, cy + h + t], pt[cx - w, cy + t]].join(" ")
    right = [pt[cx, cy + h], pt[cx + w, cy], pt[cx + w, cy + t], pt[cx, cy + h + t]].join(" ")
    m = [w / 100, h / 100, -w / 100, h / 100, cx, cy - h].map { |v| v.round(4) }.join(" ")
    logo = file_url("assets/img/logos/#{side[:logo]}.svg")
    svg << %(<polygon points="#{left}" fill="#{side[:left]}"/>)
    svg << %(<polygon points="#{right}" fill="#{side[:right]}"/>)
    svg << %(<polygon points="#{top}" fill="#{side[:top]}" stroke="#fff" stroke-width="0.6"/>)
    svg << %(<g transform="matrix(#{m})"><image href="#{logo}" x="20" y="20" width="60" height="60"/></g>)
    ly = cy + t / 2
    svg << %(<line x1="#{cx + w + 2}" y1="#{ly}" x2="#{cx + w + 8}" y2="#{ly}" stroke="#{side[:ink]}" stroke-width="0.6"/>)
    svg << %(<text x="#{cx + w + 10}" y="#{ly + 0.5}" font-size="8.5" font-weight="700" fill="#{side[:ink]}">#{side[:word]}</text>)
    svg << %(<text x="#{cx + w + 10}" y="#{ly + 6}" font-size="3.8" fill="#606c71">#{side[:note]} &#183; #{parts[i][:terms].size} terms</text>)
  end
  svg << "</svg>"
end

cover_html = <<~HTML
  <section class="cover">
    <div class="cover__top">
      <img class="cover__logo" src="#{file_url('assets/img/light-logo.png')}" alt="">
      <span>elegantfrontend.training</span>
    </div>
    <h1 class="cover__title">The Elegant<br>Frontend</h1>
    <p class="cover__subtitle">Terminology and best practices for the<br><b class="ui">UI</b>, the <b class="server">server</b> and the <b class="state">state</b> of every frontend</p>
    #{iso_stack(parts)}
    <p class="cover__author">#{esc AUTHOR}</p>
  </section>
HTML

parts_html = parts.each_with_index.map do |p, i|
  side = SIDES[i]
  <<~P
    <a class="threeparts__part" href="#part-#{p[:layer]}" style="--side: #{side[:ink]}">
      <span class="icon-box"><img src="#{file_url("assets/img/logos/#{side[:logo]}.svg")}" alt=""></span>
      <span class="threeparts__body">
        <span class="threeparts__no">Part #{p[:numeral]}</span>
        <span class="threeparts__name">#{esc p[:title]}</span>
        <span class="threeparts__intro">#{esc p[:intro]}</span>
        <span class="threeparts__meta">#{p[:terms].size} terms &middot; starts on page #{PAGE_MAP["part-#{p[:layer]}"] || "&ndash;"}</span>
      </span>
    </a>
  P
end.join

html = <<~HTML
  <!doctype html>
  <html lang="en">
  <head>
  <meta charset="utf-8">
  <title>The Elegant Frontend</title>
  <style>#{css}</style>
  </head>
  <body>
  #{cover_html}
  <section class="titlepage">
    <img class="titlepage__logo" src="file://#{File.join(DOCS, 'assets/img/light-logo.png')}" alt="">
    <h1 class="titlepage__title">The Elegant Frontend</h1>
    <p class="titlepage__subtitle">Terminology and best practices for the UI, the server and the state of a modern frontend</p>
    <div class="titlepage__rule"></div>
    <p class="titlepage__author">#{esc AUTHOR}</p>
    <p class="titlepage__site">elegantfrontend.training</p>
    <div class="titlepage__colophon">
      <p>#{built} edition &middot; #{chapter_no} chapters</p>
      <p>&copy; #{Time.now.utc.year} #{esc AUTHOR}. Built from the term pages and Agent Skills of the elegant repository (github.com/grvpanchal/elegant).</p>
    </div>
  </section>
  <section class="threeparts">
    <p class="threeparts__kicker">One architecture</p>
    <h1 class="threeparts__title">Three parts</h1>
    <p class="threeparts__lede">A designer, a developer and an enterprise each split frontend work a different way. This book splits it the way the code does: the UI people see, the server that delivers it and the state that remembers it.</p>
    #{parts_html}
  </section>
  <section class="frontmatter">
    <h1>How to read this book</h1>
    <p>Every chapter is one term, and every chapter has the same shape, so you can read the book cover to cover or jump straight to the term you need:</p>
    <ul>
      <li><b>At a glance</b>: the term in three lines.</li>
      <li><b>Key insight</b>: the one idea that makes the rest click.</li>
      <li><b>What it is</b>: the full explanation.</li>
      <li><b>In code</b>: a worked example, taken from the <code>chota-*</code> boilerplates where they implement it.</li>
      <li><b>Common mistakes</b>: what goes wrong in real codebases, and the fix.</li>
      <li><b>Best practices</b>: key principles, a do/don't list and the quality gates to check before you call it done.</li>
    </ul>
    <p>The best practices come from the same Agent Skills that ship in the <code>skills/</code> folder of the elegant repository, so what you read here is what a coding agent is told to follow. Each chapter ends with a link to the term's page on the site, where every example is shown in React, Angular, Vue and Web Components, and a quiz checks what stuck.</p>
  </section>
  <nav class="toc" id="contents">
    <h1>Contents</h1>
    <ol>#{toc}</ol>
  </nav>
  #{body}
  </body>
  </html>
HTML

out = ARGV[0] or abort("usage: build-book.rb <out.html> [pages.json]")
File.write(out, html)
puts JSON.generate(chapters: chapter_no, parts: parts.each_with_index.map { |p, i| { layer: p[:layer], title: p[:title], terms: p[:terms].size, logo: SIDES[i][:logo] } }, missing: missing.size)
