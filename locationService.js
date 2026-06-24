// services/googleFormsService.js
// -------------------------------------------------------
// WORKFLOW: "Saved to Google Sheets" node
//
// This service submits your tree scan data directly to
// your Google Form which automatically adds a new row
// to your Google Sheet. No Firebase, no API key, no
// credit card — just your free Google account.
//
// It also saves all records locally on your phone using
// AsyncStorage so you can view your collection and edit
// or delete records even without internet.
// -------------------------------------------------------

import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Google Form submit URL
const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSccXR1RK6dLuyKiL4b1xHM6rH9EI5k_SP44M5r6C701agSweQ/formResponse";

// Your entry IDs mapped to field names
const ENTRY_IDS = {
  tree_id:          "entry.342366711",
  common_name:      "entry.605178713",
  scientific_name:  "entry.749084573",
  genus:            "entry.1517407259",
  species:          "entry.388876265",
  family:           "entry.1422754020",
  photo_url:        "entry.1837300052",
  order:            "entry.1669135826",
  confidence_score: "entry.659523124",
  latitude:         "entry.2100043252",
  longitude:        "entry.1164798411",
  address:          "entry.1829073913",
  date:             "entry.1889465378",
  time:             "entry.1046792524",
  surveyor:         "entry.1986796636",
  notes:            "entry.1995579767",
};

const STORAGE_KEY = "tree_scanner_records";

// ---- SAVE A TREE RECORD --------------------------------

export const saveTreeRecord = async (treeData) => {
  // Build the record object
  const record = {
    tree_id:          treeData.tree_id,
    common_name:      treeData.commonName,
    scientific_name:  treeData.scientificName,
    genus:            treeData.genus,
    species:          treeData.species,
    family:           treeData.family,
    order:            treeData.order,
    confidence_score: treeData.confidenceScore,
    latitude:         treeData.latitude,
    longitude:        treeData.longitude,
    address:          treeData.address,
    date:             treeData.date,
    time:             treeData.time,
    surveyor:         treeData.surveyor || "Unknown",
    notes:            treeData.notes || "",
    photo_url:        treeData.photoUri || "",
  };

  // Submit to Google Forms (goes straight into your Google Sheet)
  await submitToGoogleForms(record);

  // Also save locally on phone for collection view
  await saveLocally(record);

  return record;
};

// ---- SUBMIT TO GOOGLE FORMS ----------------------------

const submitToGoogleForms = async (record) => {
  // Build the form submission body
  const formBody = Object.entries(ENTRY_IDS)
    .map(([field, entryId]) => {
      const value = record[field] !== undefined ? record[field] : "";
      return `${encodeURIComponent(entryId)}=${encodeURIComponent(value)}`;
    })
    .join("&");

  // Submit the form — Google Forms accepts POST requests
  const response = await fetch(FORM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody,
    // Google Forms redirects after submit — we don't need the response
    redirect: "follow",
  });

  // Google Forms always redirects so any response means success
  return true;
};

// ---- SAVE LOCALLY ON PHONE -----------------------------

const saveLocally = async (record) => {
  const existing = await getAllTrees();
  const updated = [record, ...existing];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

// ---- GET ALL TREES FROM LOCAL STORAGE ------------------

export const getAllTrees = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// ---- UPDATE A TREE RECORD ------------------------------

export const updateTreeRecord = async (treeId, updatedFields) => {
  const trees = await getAllTrees();
  const updated = trees.map((t) =>
    t.tree_id === treeId ? { ...t, ...updatedFields } : t
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

// ---- DELETE A TREE RECORD ------------------------------

export const deleteTreeRecord = async (treeId) => {
  const trees = await getAllTrees();
  const updated = trees.filter((t) => t.tree_id !== treeId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
