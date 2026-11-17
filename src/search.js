import pages from "./data";

/**
 * Count how many times query words appear in a page's text and URL.
 * Each query word is counted independently, then summed.
 */
export function getKeywordScore(text, query, url = "") {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  // Combine text and URL (with hyphens/dots replaced by spaces for matching)
  const searchable = (text + " " + url.replace(/[-_.]/g, " ")).toLowerCase();
  let score = 0;
  for (const word of words) {
    // Count all non-overlapping occurrences of the word as a whole word
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, "gi");
    const matches = searchable.match(regex);
    score += matches ? matches.length : 0;
  }
  return score;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Compute PageRank for all pages.
 * Damping factor d = 0.85, iterate 100 times.
 */
export function computePageRank() {
  const N = pages.length;
  const d = 0.85;
  const iterations = 100;

  // Initialize ranks equally
  let rank = {};
  for (const p of pages) {
    rank[p.page] = 1 / N;
  }

  // Build outgoing link counts
  const outCount = {};
  for (const p of pages) {
    outCount[p.page] = p.links_to.length;
  }

  // Find dangling nodes (no outgoing links)
  const danglingNodes = pages.filter((p) => p.links_to.length === 0).map((p) => p.page);

  for (let i = 0; i < iterations; i++) {
    const newRank = {};

    // Sum of rank from dangling nodes distributed equally
    let danglingSum = 0;
    for (const dn of danglingNodes) {
      danglingSum += rank[dn];
    }

    for (const p of pages) {
      let incomingSum = 0;

      // Find all pages that link TO this page
      for (const other of pages) {
        if (other.links_to.includes(p.page)) {
          incomingSum += rank[other.page] / outCount[other.page];
        }
      }

      newRank[p.page] =
        (1 - d) / N + d * (incomingSum + danglingSum / N);
    }

    rank = newRank;
  }

  return rank;
}

/**
 * Traditional keyword search: rank by keyword frequency only.
 */
export function traditionalSearch(query) {
  if (!query.trim()) return [];

  const results = [];
  for (const p of pages) {
    const score = getKeywordScore(p.text, query, p.url);
    if (score > 0) {
      results.push({ ...p, keywordScore: score, finalScore: score });
    }
  }

  results.sort((a, b) => b.finalScore - a.finalScore);
  return results;
}

/**
 * Google PageRank search: combine keyword relevance with PageRank.
 * Final Score = (Normalized Keyword × 0.4) + (Normalized PageRank × 0.6)
 */
export function googleSearch(query) {
  if (!query.trim()) return [];

  const pageRank = computePageRank();

  // Get keyword scores for matching pages
  const matchingPages = [];
  for (const p of pages) {
    const ks = getKeywordScore(p.text, query, p.url);
    if (ks > 0) {
      matchingPages.push({ ...p, keywordScore: ks, pageRank: pageRank[p.page] });
    }
  }

  if (matchingPages.length === 0) return [];

  // Normalize keyword scores: divide by max
  const maxKS = Math.max(...matchingPages.map((r) => r.keywordScore));
  // Normalize PageRank: divide by max among matching results
  const maxPR = Math.max(...matchingPages.map((r) => r.pageRank));

  const results = matchingPages.map((r) => {
    const normKS = maxKS > 0 ? r.keywordScore / maxKS : 0;
    const normPR = maxPR > 0 ? r.pageRank / maxPR : 0;
    const finalScore = normKS * 0.4 + normPR * 0.6;
    return { ...r, normKeyword: normKS, normPageRank: normPR, finalScore };
  });

  results.sort((a, b) => b.finalScore - a.finalScore);
  return results;
}
