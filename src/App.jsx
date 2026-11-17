import { useState, useCallback } from "react";
import pages from "./data";
import { traditionalSearch, googleSearch, computePageRank } from "./search";
import PageRankGraph from "./PageRankGraph";
import PagePreview from "./PagePreview";

function GoogleLogo({ small, onClick }) {
  const Tag = small ? "span" : "div";
  return (
    <Tag
      className={small ? "results-logo" : "google-logo"}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <span>
        <span className="g1">M</span>
        <span className="o1">i</span>
        <span className="o2">n</span>
        <span className="g2">i</span>
        <span className="space"> </span>
        <span className="g1">G</span>
        <span className="o1">o</span>
        <span className="o2">o</span>
        <span className="g2">g</span>
        <span className="l">l</span>
        <span className="e">e</span>
        <span className="excl">!</span>
      </span>
    </Tag>
  );
}

const DEMO_QUERIES = [
  { q: "pizza", tip: "Key demo: Page 6 (spam) ranks #1 in Traditional, Page 2 (authority) ranks #1 in PageRank" },
  { q: "Pune food", tip: "Matches local food guides and cheap eats" },
  { q: "cheese pizza", tip: "Matches fresh cheese pizza recipes and outlets" },
  { q: "canteen", tip: "Finds college canteen blog reviews" },
  { q: "recipes", tip: "Finds homemade pizza recipes" },
  { q: "cheap eats", tip: "Finds budget eats under 100 rupees" },
];

function getTitle(text) {
  // Capitalize first letter of each word, truncate
  const words = text.split(/\s+/).slice(0, 6);
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") + (text.split(/\s+/).length > 6 ? "..." : "");
}

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [mode, setMode] = useState("google"); // "traditional" or "google"
  const [preview, setPreview] = useState(null);
  const [searchedQuery, setSearchedQuery] = useState("");

  const doSearch = useCallback(
    (q) => {
      const targetQuery = typeof q === "string" ? q : query;
      const trimmed = targetQuery.trim();
      if (!trimmed) return;
      setSearchedQuery(trimmed);
      const res =
        mode === "traditional"
          ? traditionalSearch(trimmed)
          : googleSearch(trimmed);
      setResults(res);
    },
    [query, mode]
  );

  const handleLucky = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const res =
      mode === "traditional"
        ? traditionalSearch(trimmed)
        : googleSearch(trimmed);
    if (res.length > 0) {
      setPreview(res[0]);
    }
  }, [query, mode]);

  const goHome = useCallback(() => {
    setResults(null);
    setSearchedQuery("");
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults(null);
    setSearchedQuery("");
  }, []);

  const modeLabel =
    mode === "traditional"
      ? "Traditional Keyword Search \u2013 Before 1998"
      : "Google PageRank \u2013 1998";

  // ===== Homepage =====
  if (results === null) {
    return (
      <div className="home-container">
        <GoogleLogo />
        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            doSearch();
          }}
        >
          <input
            className="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a query (e.g. pizza, canteen, cheap eats)..."
            autoFocus
          />
          <div className="search-buttons">
            <button type="submit">Google Search</button>
            <button
              type="button"
              onClick={handleLucky}
            >
              I'm Feeling Lucky
            </button>
          </div>
        </form>

        <div className="algo-toggle">
          <div className="algo-toggle-buttons">
            <button
              className={mode === "traditional" ? "active" : ""}
              onClick={() => setMode("traditional")}
            >
              Traditional
            </button>
            <button
              className={mode === "google" ? "active" : ""}
              onClick={() => setMode("google")}
            >
              PageRank
            </button>
          </div>
          <div className="algo-label">{modeLabel}</div>
        </div>

        {/* Quick Demo Queries Section */}
        <div className="home-demo-section">
          <div className="demo-title">Demonstration Search Queries:</div>
          <div className="demo-buttons">
            {DEMO_QUERIES.map((dq) => (
              <button
                key={dq.q}
                type="button"
                className="demo-btn"
                title={dq.tip}
                onClick={() => {
                  setQuery(dq.q);
                  doSearch(dq.q);
                }}
              >
                "{dq.q}"
              </button>
            ))}
          </div>
          <div className="demo-hint">
            Click any query above to run it instantly. Compare <strong>"pizza"</strong> in Traditional vs PageRank mode!
          </div>
        </div>

        {/* 6 Indexed Webpages Table */}
        <div className="index-container">
          <div className="index-title">
            Search Index &mdash; 6 Indexed Webpages Available to Search
          </div>
          <table className="index-table">
            <thead>
              <tr>
                <th style={{ width: "45px", textAlign: "center" }}>Page</th>
                <th style={{ width: "190px" }}>URL (Click to Preview)</th>
                <th>Content / Text</th>
                <th style={{ width: "100px", textAlign: "center" }}>Links To</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.page}>
                  <td className="page-id-cell">#{p.page}</td>
                  <td className="url-cell">
                    <a
                      href={`#${p.url}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setPreview(p);
                      }}
                      title="Click to view webpage preview"
                    >
                      {p.url}
                    </a>
                  </td>
                  <td className="text-cell">{p.text}</td>
                  <td className="links-cell">
                    {p.links_to.map((target) => (
                      <span key={target} className="link-tag">
                        &rarr; P{target}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="home-footer">
          <em>
            This is an educational simplification of Google's original PageRank
            concept (1998), demonstrating keyword spamming vs link graph authority.
          </em>
        </div>

        {preview && (
          <PagePreview page={preview} onClose={() => setPreview(null)} />
        )}
      </div>
    );
  }

  // ===== Results Page =====
  return (
    <div className="results-page">
      <div className="results-header">
        <GoogleLogo small onClick={goHome} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            doSearch();
          }}
          style={{ display: "flex", gap: 6 }}
        >
          <input
            className="results-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
          <button type="button" onClick={clearSearch}>
            Clear
          </button>
        </form>

        <div style={{ display: "flex", gap: 0, marginLeft: 10 }}>
          <button
            style={
              mode === "traditional"
                ? { background: "#4285F4", color: "#fff", borderColor: "#4285F4" }
                : {}
            }
            onClick={() => {
              setMode("traditional");
              // Re-search with new mode
              const trimmed = query.trim();
              if (trimmed) {
                setSearchedQuery(trimmed);
                setResults(traditionalSearch(trimmed));
              }
            }}
          >
            Traditional
          </button>
          <button
            style={
              mode === "google"
                ? { background: "#4285F4", color: "#fff", borderColor: "#4285F4" }
                : {}
            }
            onClick={() => {
              setMode("google");
              const trimmed = query.trim();
              if (trimmed) {
                setSearchedQuery(trimmed);
                setResults(googleSearch(trimmed));
              }
            }}
          >
            PageRank
          </button>
        </div>

        <span className="results-algo-label">{modeLabel}</span>
      </div>

      <div className="results-body">
        <div className="results-info">
          Searched <strong>{searchedQuery}</strong> &mdash; {results.length}{" "}
          result{results.length !== 1 && "s"} found.
        </div>

        {results.length === 0 && (
          <div className="no-results">
            Your search - <strong>{searchedQuery}</strong> - did not match any
            documents.
          </div>
        )}

        {results.map((r, i) => (
          <div className="result-item" key={r.page}>
            <div
              className="result-title"
              onClick={() => setPreview(r)}
            >
              {getTitle(r.text)}
            </div>
            <div className="result-url">
              <a
                href={`http://${r.url}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  setPreview(r);
                }}
              >
                {r.url}
              </a>
            </div>
            <div className="result-desc">{r.text}</div>
            <div className="result-meta">
              Page {r.page} &nbsp;|&nbsp; Score: {r.finalScore.toFixed(4)}
              {mode === "traditional" && (
                <> &nbsp;|&nbsp; Keyword hits: {r.keywordScore}</>
              )}
              {mode === "google" && (
                <>
                  {" "}
                  &nbsp;|&nbsp; Keyword: {r.normKeyword.toFixed(3)} &times;
                  0.4 + PageRank: {r.normPageRank.toFixed(3)} &times; 0.6
                </>
              )}
            </div>
          </div>
        ))}

        {/* Educational note */}
        <div className="edu-note">
          <strong>&#x1F4D6; Educational Note:</strong> This is a simplified
          demonstration of Google's original PageRank concept. In{" "}
          <em>Traditional</em> mode, pages are ranked purely by keyword
          frequency &mdash; a page that repeats "pizza" 10 times ranks highest.
          In <em>PageRank</em> mode, the link structure between pages matters:
          pages that many other pages link to receive a higher rank, even if
          they don't repeat the keyword as often. This was the core insight
          behind Google's 1998 search engine.
        </div>

        {/* PageRank graph */}
        <PageRankGraph />
      </div>

      {preview && (
        <PagePreview page={preview} onClose={() => setPreview(null)} />
      )}
    </div>
  );
}
