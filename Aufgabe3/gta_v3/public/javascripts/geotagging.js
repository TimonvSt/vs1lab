// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {
    const mapManager = new MapManager();
    const taglist = JSON.parse(document.getElementById('map').dataset.tags);
    const latitude = document.getElementById('latitudeDiscovery').value;
    const longitude = document.getElementById('longitudeDiscovery').value;

    // Remove children from map container
    document.querySelectorAll("#mapView, .discovery__map span").forEach(child => { child.remove()});

    if (latitude == '' && longitude == '') {
        LocationHelper.findLocation(location => {
            // Update form fields with current location
            document.getElementById("latitudeTagging").value = location.latitude;
            document.getElementById("longitudeTagging").value = location.longitude;
            document.getElementById("latitudeDiscovery").value = location.latitude;
            document.getElementById("longitudeDiscovery").value = location.longitude;

            // Create Mapmanager object, initialize map and update with current location
            mapManager.initMap(location.latitude, location.longitude);
            mapManager.updateMarkers(location.latitude, location.longitude, taglist);
        });
    } else {
        // Create Mapmanager object, initialize map and update with current location
        mapManager.initMap(latitude, longitude);
        mapManager.updateMarkers(latitude, longitude, taglist);
    }
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});