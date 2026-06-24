// services/locationService.js
// -------------------------------------------------------
// WORKFLOW: "GPS captured" node
//
// This service fires the moment you press scan.
// It asks the phone for its exact GPS coordinates and
// converts them into a human-readable street address.
// Both the raw coords and the address get saved with
// every tree record so the data works in GIS systems.
// -------------------------------------------------------

import * as Location from "expo-location";

export const getLocationData = async () => {
  // Ask the user for location permission if not granted yet
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error(
      "Location permission denied. Please enable it in your phone settings."
    );
  }

  // Get the precise GPS coordinates
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  const { latitude, longitude } = location.coords;

  // Reverse geocode: convert lat/long into a street address
  const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });

  let address = "Address unavailable";

  if (geocode && geocode.length > 0) {
    const place = geocode[0];
    const parts = [
      place.streetNumber,
      place.street,
      place.city,
      place.region,
      place.postalCode,
    ].filter(Boolean);
    address = parts.join(", ");
  }

  // Build and return the full location data object
  return {
    latitude: parseFloat(latitude.toFixed(6)),
    longitude: parseFloat(longitude.toFixed(6)),
    address,
    capturedAt: new Date().toISOString(),
  };
};
