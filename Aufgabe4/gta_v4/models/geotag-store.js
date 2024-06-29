// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    #geotags;

    constructor() {
        this.#geotags = [];
    }

    // Add a geotag to the store
    addGeoTag(geotag) {
        this.#geotags.push(geotag);
    }

    // Remove geotags from the store by name
    removeGeoTag(name) {
        this.#geotags = this.#geotags.filter(geotag => geotag.name !== name);
    }

    // Get all geotags in the proximity of a location
    getNearbyGeoTags(latitude, longitude, radius) {
        return this.#geotags.filter(geotag => 
            Math.sqrt(Math.pow(geotag.latitude - latitude, 2) + Math.pow(geotag.longitude - longitude, 2)) <= radius
        );
    }

    // Search for geotags in the proximity of a location that match a keyword
    searchNearbyGeoTags(latitude, longitude, radius, keyword) {
        const lowerKeyword = keyword.toLowerCase();
        return this.getNearbyGeoTags(latitude, longitude, radius).filter(geotag => 
            geotag.name.toLowerCase().includes(lowerKeyword) || geotag.hashtag.toLowerCase().includes(lowerKeyword)
        );
    }
}

module.exports = InMemoryGeoTagStore;
