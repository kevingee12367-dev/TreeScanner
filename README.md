// services/exportService.js
// -------------------------------------------------------
// WORKFLOW: "Export data" node
//
// This service reads all saved tree records from Firestore
// and converts them into three formats:
//
//   CSV       → Excel, Google Sheets
//   GeoJSON   → ArcGIS, QGIS, mapping tools
//   Shapefile → City/urban forestry databases
//              (simplified GeoJSON with .shp naming
//               for compatibility — full binary Shapefile
//               generation requires a desktop tool)
//
// This is what makes your data portable and lets it
// migrate to professional systems.
// -------------------------------------------------------

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

// ---- EXPORT AS CSV -------------------------------------

export const exportCSV = async (trees) => {
  const headers = [
    "tree_id",
    "common_name",
    "scientific_name",
    "genus",
    "species",
    "family",
    "order",
    "confidence_score",
    "latitude",
    "longitude",
    "address",
    "date",
    "time",
    "surveyor",
    "notes",
    "photo_url",
  ].join(",");

  const rows = trees.map((t) =>
    [
      t.tree_id,
      `"${t.common_name}"`,
      `"${t.scientific_name}"`,
      `"${t.genus}"`,
      `"${t.species}"`,
      `"${t.family}"`,
      `"${t.order}"`,
      t.confidence_score,
      t.latitude,
      t.longitude,
      `"${t.address}"`,
      t.date,
      t.time,
      `"${t.surveyor}"`,
      `"${t.notes}"`,
      `"${t.photo_url}"`,
    ].join(",")
  );

  const csvContent = [headers, ...rows].join("\n");
  return await shareFile(csvContent, "tree_data.csv", "text/csv");
};

// ---- EXPORT AS GEOJSON ---------------------------------

export const exportGeoJSON = async (trees) => {
  const geojson = {
    type: "FeatureCollection",
    features: trees.map((t) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [t.longitude, t.latitude],
      },
      properties: {
        tree_id: t.tree_id,
        common_name: t.common_name,
        scientific_name: t.scientific_name,
        genus: t.genus,
        species: t.species,
        family: t.family,
        order: t.order,
        confidence_score: t.confidence_score,
        address: t.address,
        date: t.date,
        time: t.time,
        surveyor: t.surveyor,
        notes: t.notes,
        photo_url: t.photo_url,
      },
    })),
  };

  const content = JSON.stringify(geojson, null, 2);
  return await shareFile(content, "tree_data.geojson", "application/json");
};

// ---- EXPORT AS SHAPEFILE-COMPATIBLE GEOJSON ------------
// Note: True binary Shapefiles require desktop GIS tools.
// This exports a GeoJSON with Shapefile-compatible field
// names (max 10 chars) that ArcGIS and QGIS can convert
// directly. This is the professional standard approach
// for mobile-to-GIS data pipelines.

export const exportShapefile = async (trees) => {
  const geojson = {
    type: "FeatureCollection",
    features: trees.map((t) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [t.longitude, t.latitude],
      },
      properties: {
        tree_id: t.tree_id,
        cmn_name: t.common_name,        // max 10 chars for .dbf
        sci_name: t.scientific_name,
        genus: t.genus,
        species: t.species,
        family: t.family,
        order: t.order,
        confidence: t.confidence_score,
        address: t.address,
        date: t.date,
        time: t.time,
        surveyor: t.surveyor,
        notes: t.notes,
      },
    })),
  };

  const content = JSON.stringify(geojson, null, 2);
  return await shareFile(content, "tree_data_shapefile.geojson", "application/json");
};

// ---- SHARED FILE HELPER --------------------------------

const shareFile = async (content, filename, mimeType) => {
  const fileUri = FileSystem.documentDirectory + filename;

  await FileSystem.writeAsStringAsync(fileUri, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error("Sharing is not available on this device.");
  }

  await Sharing.shareAsync(fileUri, {
    mimeType,
    dialogTitle: `Export ${filename}`,
  });

  return fileUri;
};
