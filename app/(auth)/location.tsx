import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Button, Linking, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';

const LocationScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);
  const [isTracking, setIsTracking] = useState(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  // Request permissions and get initial location
  useEffect(() => {
    (async () => {
      try {
        // Request permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(location);
        setLoading(false);

        // Start watching position
        startLocationTracking();
      } catch (error) {
        setErrorMsg('Error fetching location');
        setLoading(false);
      }
    })();

    // Cleanup function to remove location subscription
    return () => {
      if (isTracking) {
        stopLocationTracking();
      }
    };
  }, []);

  // Start watching location changes
  const startLocationTracking = async () => {
    try {
      setIsTracking(true);
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation);
          
          // Update marker position on the map
          if (webViewRef.current) {
            const lat = newLocation.coords.latitude;
            const lng = newLocation.coords.longitude;
            webViewRef.current.injectJavaScript(`
              if (marker) {
                marker.setLatLng([${lat}, ${lng}]);
                map.setView([${lat}, ${lng}], map.getZoom());
                marker.bindPopup("You are here").openPopup();
              }
              true;
            `);
          }
        }
      );
      locationSubscription.current = subscription;
    } catch (error) {
      setErrorMsg('Failed to start location tracking');
    }
  };
  
  // Stop watching location
  const stopLocationTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    setIsTracking(false);
  };

  // Function to open Google Maps with nearby mental health facilities
  const findNearbyMentalHealthFacilities = () => {
    if (!location) return;
    
    const { latitude, longitude } = location.coords;
    const query = 'clinic+hospital+psychologist';
    let url;
    
    if (Platform.OS === 'ios') {
      url = `maps://maps.google.com/maps?q=${query}&sll=${latitude},${longitude}&z=13`;
    } else {
      url = `https://maps.google.com/maps?q=${query}&sll=${latitude},${longitude}&z=13`;
    }
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          // If Google Maps app is not installed, open in browser
          Linking.openURL(`https://www.google.com/maps/search/${query}/@${latitude},${longitude},13z`);
        }
      })
      .catch(err => setErrorMsg('Could not open maps: ' + err));
  };

  // Generate the HTML to display OpenStreetMap
  const generateMapHTML = (lat: number, lng: number) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <style>
            body { margin: 0; padding: 0; }
            #map { width: 100%; height: 100vh; }
            .custom-popup { font-weight: bold; color: #3388ff; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            let marker;
            const map = L.map('map').setView([${lat}, ${lng}], 16);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            
            // Create a custom icon for better visibility
            const customIcon = L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
              shadowSize: [41, 41]
            });
            
            // Add marker with custom popup
            marker = L.marker([${lat}, ${lng}], {icon: customIcon}).addTo(map);
            marker.bindPopup("<div class='custom-popup'>You are here</div>").openPopup();
            
            // Add accuracy circle
            L.circle([${lat}, ${lng}], {
              color: '#3388ff',
              fillColor: '#3388ff',
              fillOpacity: 0.2,
              radius: 50
            }).addTo(map);
          </script>
        </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : errorMsg ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : location ? (
        <View style={styles.mapContainer}>
          <WebView
            ref={webViewRef}
            style={styles.map}
            originWhitelist={['*']}
            source={{ html: generateMapHTML(location.coords.latitude, location.coords.longitude) }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
          
          <View style={styles.coordsContainer}>
            <Text style={styles.coordsText}>
              Latitude: {location.coords.latitude.toFixed(6)}
            </Text>
            <Text style={styles.coordsText}>
              Longitude: {location.coords.longitude.toFixed(6)}
            </Text>
            <Text style={styles.coordsText}>
              Accuracy: ±{Math.round(location.coords.accuracy || 0)}m
            </Text>
          </View>
          
          <View style={styles.buttonsContainer}>
            <Button 
              title={isTracking ? "Stop Tracking" : "Track My Location"} 
              onPress={isTracking ? stopLocationTracking : startLocationTracking}
              color="#3388ff"
            />
            <View style={styles.buttonSpacer} />
            <Button
              title="Find Nearby Mental Health Services"
              onPress={findNearbyMentalHealthFacilities}
              color="#5cb85c"
            />
          </View>
        </View>
      ) : (
        <Text>Waiting for location...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#ffeeee',
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  coordsContainer: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
    width: '80%',
    zIndex: 1000,
  },
  coordsText: {
    textAlign: 'center',
    fontSize: 16,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 40,
    width: '80%',
    zIndex: 1000,
  },
  buttonSpacer: {
    height: 10,
  }
});

export default LocationScreen;