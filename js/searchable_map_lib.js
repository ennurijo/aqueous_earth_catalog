const SearchableMapLib = {
    map: null,
    markers: [],
    data: [],
    currentSearch: '',

    initialize: function(options) {
        // The path to your CSV file - INPUT YOUR FILE PATH HERE
        this.filePath = options.filePath;  // "data/Hydrography Dec 23 2023 Test"
        
        // The file type, which should be "csv" for your case
        this.fileType = options.fileType || "csv"; // You should leave this as "csv" for your CSV file

        // The name of a single record (film title or similar)
        this.recordName = options.recordName;  // "Film"

        // The plural name of the record (films or similar)
        this.recordNamePlural = options.recordNamePlural; // "Films"

        // Centroid of the map to set initial map center (default to Paris if not specified)
        this.mapCentroid = options.map_centroid || [48.8575, 2.3514]; // Default to Paris, France

        // The default zoom level of the map
        this.defaultZoom = options.defaultZoom || 13;

        // The default search radius (default to 1 mile in meters)
        this.defaultRadius = options.defaultRadius || 1610; // Default radius in meters (1 mile)

        // Option to enable debug mode (set to true to view debug messages)
        this.debug = options.debug || false;

        // Create the map using the Google Maps API
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: this.mapCentroid[0], lng: this.mapCentroid[1] },
            zoom: this.defaultZoom
        });

        // Load data (CSV file) and process it
        this.loadData();
    },

    // Load the CSV data and process it into markers on the map
    loadData: function() {
        const _this = this;
        
        // Load CSV file
        d3.csv(`${this.filePath}.${this.fileType}`)
            .then(function(data) {
                _this.data = data;
                _this.createMarkers();  // Create markers after data is loaded
            })
            .catch(function(error) {
                console.error("Error loading data: ", error);
            });
    },

    // Create markers on the map based on loaded data
    createMarkers: function() {
        const _this = this;

        // Loop through the data and create markers
        this.data.forEach(function(d) {
            const lat = parseFloat(d.latitude);
            const lng = parseFloat(d.longitude);

            if (lat && lng) {
                const marker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map: _this.map,
                    title: d["film title"] || "No Title",  // Marker title from data
                    customData: d  // Store the entire data record for later use
                });

                 // Search function to filter markers
    doSearch: function() {
        const searchTerm = document.getElementById("search-input").value.toLowerCase();
        const filterType = document.getElementById("search-filter").value;

        // Iterate over markers and filter based on search term and selected filter
        this.markers.forEach(function(marker, index) {
            const record = SearchableMapLib.data[index];  // Get the record from data
            let fieldValue = '';

            // Determine the field to filter based on the selected filter type
            switch (filterType) {
                case 'Title':
                    fieldValue = record["film title"] ? record["film title"].toLowerCase() : '';
                    break;
                case 'Release Year':
                    fieldValue = record["release year"] ? record["release year"].toString().toLowerCase() : '';
                    break;
                case 'Location':
                    fieldValue = record["location"] ? record["location"].toLowerCase() : '';
                    break;
                case 'Director':
                    fieldValue = record["director"] ? record["director"].toLowerCase() : '';
                    break;
                default:
                    fieldValue = '';
            }

            // Check if the search term matches the field value
            if (fieldValue.includes(searchTerm)) {
                marker.setVisible(true);  // Show the marker if it matches
            } else {
                marker.setVisible(false);  // Hide the marker if it doesn't match
            }
        });
    },

    // Reset the search
    resetSearch: function() {
        document.getElementById("search-input").value = '';  // Clear search input
        document.getElementById("search-filter").value = 'Title';  // Reset filter to 'Title'
        this.markers.forEach(function(marker) {
            marker.setVisible(true);  // Reset visibility of all markers
        });
    }
};
