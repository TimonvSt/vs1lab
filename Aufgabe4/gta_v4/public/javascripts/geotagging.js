// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

let mapManager = new MapManager();
let currentPage = 1;

/**
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation(taglist = JSON.parse(document.getElementById('map').dataset.tags)) {
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
        mapManager.updateMarkers(latitude, longitude, taglist);
    }

}

async function handleTagSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const latitude = document.getElementById("latitudeTagging").value;
    const longitude = document.getElementById("longitudeTagging").value;
    const hashtag = document.getElementById("hashtag").value;

    // Check if all geoTag information are given
    if (name && latitude && longitude && hashtag) {
        const geoTag = { name, latitude, longitude, hashtag };
        fetch("/api/geotags", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(geoTag)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);

            // Reset name and hashtag input value
            document.getElementById("name").value = '';
            document.getElementById("hashtag").value = '';
        })
        .catch(error => console.error("Error:", error));
    } else {
        alert("All fields are required.");
    }
}

async function handleDiscoverySubmit(event) {
    event.preventDefault();

    const searchterm = document.getElementById("searchterm").value;
    const latitude = document.getElementById("latitudeDiscovery").value;
    const longitude = document.getElementById("longitudeDiscovery").value;

    let query = `/api/geotags?page=${currentPage}&`;
    if (searchterm) {
        query += `searchterm=${searchterm}&`;
    }
    if (latitude && longitude) {
        query += `latitude=${latitude}&longitude=${longitude}&`;
    }
    
    fetch(query)
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);
        updateDiscoveryWidget(data);
        updateLocation(data.tagList);
        currentPage = data.serverPage;
    })
    .catch(error => console.error("Error:", error));
}

function updateDiscoveryWidget(data) {
    const list = document.getElementById("discoveryResults");
    list.innerHTML = "";
    data.tagList.forEach(tag => {
        const li = document.createElement("li");
        li.textContent = `${tag.name} (${tag.latitude}, ${tag.longitude}) - ${tag.hashtag}`;
        list.appendChild(li);
    });

    // add pagination
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    const prev = document.createElement("a");
    prev.id = "prevPage";
    prev.textContent = "<";
    pagination.appendChild(prev);
    const pages = document.createElement("span");
    pages.textContent = ` Page ${data.serverPage} of ${data.lastPage} `;
    pagination.appendChild(pages);
    const next = document.createElement("a");
    next.id = "nextPage";
    next.textContent = ">";
    pagination.appendChild(next);

    document.getElementById("prevPage").addEventListener("click", (e) => {
        if (1 < currentPage) {
            currentPage--;
        }
        handleDiscoverySubmit(e);
    });
    document.getElementById("nextPage").addEventListener("click", (e) => {
        currentPage++;
        handleDiscoverySubmit(e);
    });  
}



// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", function() {
    updateLocation();
    document.getElementById("tag-form").addEventListener("submit", handleTagSubmit);
    document.getElementById("discoveryFilterForm").addEventListener("submit", handleDiscoverySubmit);
});

