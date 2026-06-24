{
  "expo": {
    "name": "Tree Scanner",
    "slug": "treescanner",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "resizeMode": "contain",
      "backgroundColor": "#1D9E75"
    },
    "ios": {
      "supportsTablet": false,
      "infoPlist": {
        "NSCameraUsageDescription": "Tree Scanner needs camera access to photograph and identify trees.",
        "NSLocationWhenInUseUsageDescription": "Tree Scanner needs your location to record where each tree is.",
        "NSPhotoLibraryUsageDescription": "Tree Scanner saves tree photos to your library."
      }
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#1D9E75"
      },
      "permissions": [
        "CAMERA",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Tree Scanner needs camera access to photograph and identify trees."
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Tree Scanner needs your location to record where each tree is."
        }
      ]
    ]
  }
}
