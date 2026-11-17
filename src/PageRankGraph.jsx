import { useState, useMemo } from "react";
import pages from "./data";
import { computePageRank } from "./search";

const WIDTH = 520;
const HEIGHT = 360;

// Position nodes in a circle
function getNodePositions() {
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;
  const radius = 130;
  const positions = {};
  pages.forEach((p, i) => {
    const angle = (i / pages.length) * 2 * Math.PI - Math.PI / 2;
    positions[p.page] = {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });
  return positions;
}

// Shorten a URL for display
function shortUrl(url) {
  return url.replace(/\.com$/, "");
}

export default function PageRankGraph() {
  const [hoveredNode, setHoveredNode] = useState(null);

  const pageRank = useMemo(() => computePageRank(), []);
  const positions = useMemo(() => getNodePositions(), []);

  const maxRank = Math.max(...Object.values(pageRank));
  const minRank = Math.min(...Object.values(pageRank));

  // Build edges
  const edges = [];
  for (const p of pages) {
    for (const target of p.links_to) {
      edges.push({ from: p.page, to: target });
    }
  }

  // Compute arrow path with offset so it doesn't overlap the node circle
  function getArrow(from, to) {
    const x1 = positions[from].x;
    const y1 = positions[from].y;
    const x2 = positions[to].x;
    const y2 = positions[to].y;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return null;

    const nodeRadius = 24;
    const ux = dx / dist;
    const uy = dy / dist;

    // Start just outside source node, end just outside target node
    const sx = x1 + ux * (nodeRadius + 2);
    const sy = y1 + uy * (nodeRadius + 2);
    const ex = x2 - ux * (nodeRadius + 6);
    const ey = y2 - uy * (nodeRadius + 6);

    return { sx, sy, ex, ey };
  }

  // Node size based on PageRank
  function nodeRadius(page) {
    const norm =
      maxRank === minRank
        ? 0.5
        : (pageRank[page] - minRank) / (maxRank - minRank);
    return 16 + norm * 14; // 16–30
  }

  // Node color: higher PageRank = more blue
  function nodeColor(page) {
    const norm =
      maxRank === minRank
        ? 0.5
        : (pageRank[page] - minRank) / (maxRank - minRank);
    const r = Math.round(200 - norm * 150);
    const g = Math.round(200 - norm * 100);
    const b = Math.round(220 + norm * 35);
    return `rgb(${r},${g},${b})`;
  }

  const hovered = hoveredNode
    ? pages.find((p) => p.page === hoveredNode)
    : null;

  return (
    <div className="visualization-section">
      <h3>&#x1F310; PageRank Network Visualization</h3>
      <div className="graph-container">
        <svg width={WIDTH} height={HEIGHT}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#888" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((e, i) => {
            const arrow = getArrow(e.from, e.to);
            if (!arrow) return null;
            return (
              <line
                key={i}
                x1={arrow.sx}
                y1={arrow.sy}
                x2={arrow.ex}
                y2={arrow.ey}
                stroke="#aaa"
                strokeWidth="1.5"
                markerEnd="url(#arrowhead)"
              />
            );
          })}

          {/* Nodes */}
          {pages.map((p) => {
            const pos = positions[p.page];
            const r = nodeRadius(p.page);
            const isHovered = hoveredNode === p.page;
            return (
              <g
                key={p.page}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredNode(p.page)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setHoveredNode(p.page)}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={r}
                  fill={nodeColor(p.page)}
                  stroke={isHovered ? "#333" : "#666"}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                />
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="11"
                  fontFamily="Arial"
                  fontWeight="bold"
                  fill="#fff"
                >
                  P{p.page}
                </text>
                {/* URL label below node */}
                <text
                  x={pos.x}
                  y={pos.y + r + 12}
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="Arial"
                  fill="#555"
                >
                  {shortUrl(p.url)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="node-tooltip">
        {hovered ? (
          <>
            <strong>{hovered.url}</strong> &mdash; PageRank:{" "}
            {pageRank[hovered.page].toFixed(5)} &mdash; Links to:{" "}
            {hovered.links_to.map((l) => `P${l}`).join(", ")}
          </>
        ) : (
          <span style={{ color: "#aaa" }}>
            Hover or click a node to see details. Larger = higher PageRank.
          </span>
        )}
      </div>
    </div>
  );
}
