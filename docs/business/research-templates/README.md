# Research Templates

Spreadsheets for market research and subcontractor sourcing.

## Files

| File | Purpose |
|------|---------|
| `freelancer-rates.csv` | Rate data collection by skill/platform |
| `potential-subcontractors.csv` | Subcontractor evaluation database |

## How to Use

### Option 1: Google Sheets (recommended)
1. Upload CSV to Google Drive
2. Open with Google Sheets
3. Share with team if needed

### Option 2: Excel
1. Open CSV directly in Excel
2. Save as .xlsx for full features

### Option 3: Notion
1. Import CSV as database
2. Add views (by skill, by platform, etc.)

## Column Guide

### freelancer-rates.csv

| Column | Description | Example Values |
|--------|-------------|----------------|
| Skill Category | Main automation skill | n8n, Zapier, Make, Xero Integration, AI Automation |
| Experience Level | Seniority | Entry, Mid, Senior, Expert |
| Hourly Rate (GBP) | £ per hour | 25, 50, 100 |
| Fixed Project Min/Max | Typical project range | 100, 500 |
| Platform | Source | Upwork, Fiverr, PeoplePerHour |

### potential-subcontractors.csv

| Column | Description | Example Values |
|--------|-------------|----------------|
| n8n, Zapier, Make, etc. | Skill level | (blank), Basic, Good, Strong |
| English Quality | Communication | Native, Fluent, Good, Basic |
| Availability | Capacity | Full-time, Part-time, Project-based |
| Status | Pipeline stage | Prospect, Contacted, Tested, Approved, Active, Do Not Use |
| Test Project Result | Outcome | Pass, Fail, Pending |

## Analysis Tips

### In Google Sheets

```
# Median hourly rate for n8n developers
=MEDIAN(FILTER(D:D, C:C="n8n"))

# Average rate by experience level
=AVERAGEIF(J:J, "Senior", D:D)

# Count by platform
=COUNTIF(B:B, "Upwork")
```

### Pivot Tables

1. Select all data
2. Insert > Pivot table
3. Rows: Skill Category
4. Columns: Experience Level
5. Values: Average of Hourly Rate

## Search URLs

### Upwork
- [n8n developers](https://www.upwork.com/search/profiles/?q=n8n)
- [Zapier experts](https://www.upwork.com/search/profiles/?q=zapier)
- [Make specialists](https://www.upwork.com/search/profiles/?q=make%20integromat)
- [Xero integration](https://www.upwork.com/search/profiles/?q=xero%20integration%20uk)

### Fiverr
- [n8n gigs](https://www.fiverr.com/search/gigs?query=n8n)
- [Zapier gigs](https://www.fiverr.com/search/gigs?query=zapier%20automation)
- [Make gigs](https://www.fiverr.com/search/gigs?query=make%20integromat)

### PeoplePerHour
- [Automation freelancers](https://www.peopleperhour.com/freelancers?q=automation)
- [Zapier freelancers](https://www.peopleperhour.com/freelancers?q=zapier)
