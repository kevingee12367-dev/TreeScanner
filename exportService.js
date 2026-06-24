// services/iNaturalistService.js
// -------------------------------------------------------
// WORKFLOW: "Photo → iNaturalist API" and "Tree identified"
//
// This service takes the photo you captured, sends it to
// iNaturalist's computer vision API, and returns the tree's
// genus, species, common name, confidence score, and
// full taxonomy. Free with no daily hard limit.
// -------------------------------------------------------

const INATURALIST_API = "https://api.inaturalist.org/v1";

export const identifyTree = async (photoUri) => {
  // Read the photo and convert it to a format the API accepts
  const formData = new FormData();
  formData.append("image", {
    uri: photoUri,
    type: "image/jpeg",
    name: "tree_scan.jpg",
  });

  // Only search for plants (iconic_taxa=Plantae filters out animals etc.)
  formData.append("iconic_taxa[]", "Plantae");

  const response = await fetch(`${INATURALIST_API}/computervision/score_image`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      "User-Agent": "TreeScanner/1.0",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`iNaturalist API error: ${response.status}`);
  }

  const data = await response.json();

  // iNaturalist returns a ranked list of possibilities.
  // We take the top result as the primary identification.
  if (!data.results || data.results.length === 0) {
    throw new Error("No identification results returned. Try a clearer photo.");
  }

  const topResult = data.results[0];
  const taxon = topResult.taxon;

  // Pull out the taxonomy details
  const ancestors = taxon.ancestors || [];
  const family =
    ancestors.find((a) => a.rank === "family")?.name || "Unknown";
  const order =
    ancestors.find((a) => a.rank === "order")?.name || "Unknown";

  return {
    commonName: taxon.preferred_common_name || taxon.name,
    scientificName: taxon.name,
    genus: taxon.rank === "genus" ? taxon.name : taxon.name.split(" ")[0],
    species: taxon.rank === "species" ? taxon.name : "Unknown",
    family,
    order,
    confidenceScore: Math.round(topResult.combined_score * 100),
    taxonId: taxon.id,
    wikipediaUrl: taxon.wikipedia_url || null,
    iconicTaxon: taxon.iconic_taxon_name || "Plantae",
    // Keep top 3 alternatives in case you want to show them
    alternatives: data.results.slice(1, 3).map((r) => ({
      name: r.taxon.preferred_common_name || r.taxon.name,
      scientificName: r.taxon.name,
      confidence: Math.round(r.combined_score * 100),
    })),
  };
};
