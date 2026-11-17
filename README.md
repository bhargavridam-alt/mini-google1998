#  Mini Google – Search Evolution (1998)

A simplified recreation of Google's original 1998 search experience, demonstrating how search engines evolved from basic keyword matching to Google's revolutionary PageRank algorithm.

##  About the Project

What made Google different from traditional search engines?

This project explores that question through a mini search engine built around six predefined webpages.

It allows users to search using two different approaches and compare how the ranking of webpages changes.

## Features

- **1998 Google UI:** A minimalist interface inspired by Google's original homepage.
- **Traditional Keyword Search:** Ranks webpages based on keyword frequency.
- **Google PageRank (1998):** Implements a simplified PageRank algorithm using webpage connections.
- **Interactive Comparison:** Switch between both algorithms and observe ranking differences.
- **PageRank Visualization:** Displays six webpages as connected nodes.
- **Simulated Search Engine:** Works entirely with a predefined dataset without external APIs.

## How It Works

### 1. Traditional Keyword Search

The traditional search simulation ranks webpages based on how frequently the searched keyword appears in their content.

This demonstrates how keyword-heavy pages could receive higher rankings.

### 2. Google PageRank

The PageRank simulation considers the links between webpages to estimate their importance.

It uses:
- Damping factor: `0.85`
- Link-based ranking
- Keyword relevance
- Iterative PageRank calculation

The final ranking combines both signals:

`Final Score = (Keyword Relevance × 0.4) + (Normalized PageRank × 0.6)`

*Note: This is an educational simplification, not an exact reproduction of Google's original search algorithm.*

## Dataset

The search engine uses six predefined webpages:

| Page | Website |
|---|---|
| 1 | pune-food-guide.com |
| 2 | best-pizza-pune.com |
| 3 | college-canteen-blog.com |
| 4 | pizza-recipes-home.com |
| 5 | cheap-eats-pune.com |
| 6 | pizza-pizza-pizza.com |

## 🛠️ Tech Stack

- React
- JavaScript
- CSS
- SVG

##  Project Objective

To understand the fundamental difference between keyword-based search and link-based ranking through a simple, interactive implementation.

Rather than just reading about PageRank, users can experiment with search queries and see how webpage rankings change.

## Key Learning

- Search engine fundamentals
- Keyword matching and relevance
- PageRank algorithm
- Directed graphs and webpage relationships
- Frontend development and interactive UI

## Author

**Ridam Bhargav**



*Built as a small exploration of one of the most influential ideas in the history of the internet.*
