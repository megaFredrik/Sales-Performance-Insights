# Sales Performance Insights

AI-assisted sales insights dashboard for monthly SaaS sales reviews.

## What it does

The dashboard helps managers quickly understand:

- Which regions perform best
- Which sales reps lead or need attention
- Which products drive the most revenue
- How performance changes when the focus metric is Revenue, Deals Closed, or Average Deal Size
- A plain-language executive summary and discussion points

## Privacy by design

Sales data is loaded from a CSV selected by the user and processed in the browser. The demo does not send uploaded sales data to a backend or external AI service.

## Demo data

`sample-sales-data.csv` contains fictional sales data for demonstration purposes.

## Expected CSV columns

```text
Month, Region, Sales Rep, Product, Revenue, Deals Closed
```

The dashboard also accepts common variations such as `Rep` and `DealsClosed`.

## Run locally

No build step is required. Open `index.html` in a modern browser, or serve the folder with any static web server.

For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Technology

- HTML
- CSS
- Vanilla JavaScript
- Chart.js
- Papa Parse

External libraries are loaded from public CDNs. The sales data itself remains in the browser.

## AI-assisted approach

The current version uses transparent, data-driven insight rules rather than sending company data to a generative AI API. This keeps the prototype private and easy to audit while still demonstrating AI-assisted decision support behavior.

The recommendations are explicitly advisory: they are discussion inputs, not final business decisions.

## Project structure

- `index.html` — dashboard structure
- `styles.css` — visual design and responsive layout
- `app.js` — CSV parsing, calculations, charts and insight generation
- `sample-sales-data.csv` — fictional demo dataset

## Assignment mapping

| Requirement | Implementation |
|---|---|
| Summarize by region, rep and product | KPI cards, charts and scorecards |
| Highlight top performers | Dynamic top performer and ranking badge |
| Highlight areas needing attention | Dynamic attention list based on selected metric |
| Executive summary | Automatically generated from uploaded data |
| Switch metrics | Revenue / Deals Closed / Average Deal Size selector |
| Private uploaded data | Client-side CSV processing |
| Shareable | Static web app suitable for GitHub Pages |

## Disclaimer

Insights are generated from the uploaded dataset and should be used as input for management discussion, not as automated final decisions.
