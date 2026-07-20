## 🚀 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/kevingee12367/TreeScanner.git
cd TreeScanner
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Set up Google Forms
- Create a free Google Form at forms.google.com
- Add all data fields as short answer questions
- Link the form to a Google Sheet
- Update the form URL and entry IDs in googleFormsService.js

### 4. Run the app
```bash
npx expo start
```
- Download Expo Go on your phone (free on App Store or Google Play)
- Scan the QR code that appears in your terminal

## 📤 Export Formats

- **CSV** — opens directly in Excel or Google Sheets
- **GeoJSON** — loads into ArcGIS, QGIS, or any mapping platform
- **Shapefile-compatible** — GeoJSON with 10-character field names ready for ArcGIS/QGIS conversion

## 🔒 Security

- API keys stored in .env file which is excluded from GitHub via .gitignore
- No sensitive credentials committed to the repository
- Dependency vulnerabilities managed via npm audit

## 👤 Built By

Kevin Gee Jr.
IT Support Specialist | VeritaGeo Solutions
Purdue Global — B.S. Information Technology

Built as a professional portfolio project demonstrating:
- Mobile app development with React Native
- REST API integration with PlantNet
- GIS data pipeline design and export
- Relational database schema design
- Google Sheets automation via Forms API
- EAS cloud deployment with Expo
