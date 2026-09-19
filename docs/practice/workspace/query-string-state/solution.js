const SORTS = ["relevance", "price-asc", "price-desc", "newest"];

const CODECS = {
  q: { encode: (v) => v, decode: (v) => v, default: "" },
  categories: {
    encode: (v) => v.join(","),
    decode: (v) => v.split(",").map((s) => s.trim()).filter(Boolean),
    default: [],
  },
  sort: { encode: (v) => v, decode: (v) => (SORTS.includes(v) ? v : "relevance"), default: "relevance" },
  page: {
    encode: String,
    decode: (v) => (/^\d+$/.test(v) && Number(v) > 0 ? Number(v) : 1),
    default: 1,
  },
};
const ORDER = ["q", "categories", "sort", "page"];

const isDefault = (key, value) =>
  Array.isArray(value) ? value.length === 0 : value === CODECS[key].default;

export function toQuery(filters) {
  const params = new URLSearchParams();
  for (const key of ORDER) {
    const value = filters && key in filters ? filters[key] : CODECS[key].default;
    if (!isDefault(key, value)) params.set(key, CODECS[key].encode(value));
  }
  return params.toString();
}

export function fromQuery(search) {
  const params = new URLSearchParams(String(search || "").replace(/^\?/, ""));
  const out = {};
  for (const key of ORDER) {
    const raw = params.get(key);
    out[key] = raw === null ? CODECS[key].default : CODECS[key].decode(raw);
  }
  return out;
}
