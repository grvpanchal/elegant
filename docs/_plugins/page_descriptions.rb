# frozen_string_literal: true

# A page with no `description` takes one from its own words, so its search
# snippet and share card say what the page is (jekyll-seo-tag reads
# page.description):
#
# - a practice question: its `summary`, the line the bank already shows;
# - a term doc: the first sentence of its "Key Insight".
#
# A page with neither keeps none: a description is never made up.
module PageDescriptions
  LIMIT = 160

  def self.plain(text)
    text.gsub(/\[([^\]]*)\]\([^)]*\)/, '\1')   # [text](url) -> text
        .gsub(/[*_`]/, "")
        .gsub(/\s+/, " ")
        .strip
  end

  def self.first_sentence(text)
    sentence = text[/\A.+?[.!?](?=\s|\z)/] || text
    return sentence if sentence.length <= LIMIT

    "#{sentence[0, LIMIT - 1].sub(/\s+\S*\z/, '')}…"
  end

  def self.from(page)
    summary = page.data["summary"].to_s.strip
    return summary unless summary.empty?

    insight = page.content.to_s[/^## Key Insight[ \t]*\n+(.+?)(?:\n[ \t]*\n|\z)/m, 1]
    insight && first_sentence(plain(insight))
  end
end

# After every file is read and before any is rendered: a page's Liquid copy is
# taken before :pre_render hooks run, so a description set then comes too late.
Jekyll::Hooks.register :site, :post_read do |site|
  (site.pages + site.documents).each do |page|
    next unless page.data["description"].to_s.strip.empty?

    found = PageDescriptions.from(page)
    page.data["description"] = found unless found.nil? || found.empty?
  end
end
