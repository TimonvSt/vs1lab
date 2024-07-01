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
    #currentId;

    constructor() {
        this.#geotags = [];
        this.#currentId = 1;
    }

    // Add a geotag to the store
    add(geotag) {
        geotag.id = this.#currentId++;
        this.#geotags.push(geotag);
    }

    getAll() {
        return this.#geotags;
    }

    getById(id) {
        return this.#geotags.find(tag => tag.id === parseInt(id));
    }

    searchByName(name) {
        return this.#geotags.filter(tag => tag.name.toLowerCase().includes(name.toLowerCase()));
    }

    searchNearby(lat, lon, radius) {
        return this.#geotags.filter(tag => 
            Math.sqrt(Math.pow(tag.latitude - lat, 2) + Math.pow(tag.longitude - lon, 2)) <= radius
        );
    }

    update(id, newGeoTag) {
        const index = this.#geotags.findIndex(tag => tag.id === parseInt(id));
        if (index !== -1) {
            newGeoTag.id = parseInt(id);
            this.#geotags[index] = newGeoTag;
            return true;
        }
        return false;
    }

    delete(id) {
        const index = this.#geotags.findIndex(tag => tag.id === parseInt(id));
        if (index !== -1) {
            this.#geotags.splice(index, 1);
            return true;
        }
        return false;
    }
}

module.exports = InMemoryGeoTagStore;
