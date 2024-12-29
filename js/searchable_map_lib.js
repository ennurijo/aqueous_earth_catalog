var SearchableMapLib = {
    map: null,
    markers: [],
    data: [],
    currentSearch: '',

    initialize: function(options) {
        this.filePath = options.filePath; // Path to your CSV file
        this.fileType = options.fileType || "csv"; // File type (default: csv)
        this.recordName = options.recordName; // Singular record name (e.g., Film)
        this.recordNamePlural = options.recordNamePlural; // Plural record name (e.g., Films)
        this.mapCentroid = options.mapCentroid || [48.8575, 2.3514]; // Default to Paris, France
        this.defaultZoom = options.defaultZoom || 7;
        this.defaultRadius = options.defaultRadius || 1610; // Default radius in meters (1 mile)
        this.debug = options.debug || false;

        // Initialize the map
        this.map = new google.maps.Map(document.getElementById('mapCanvas'), {
            center: { lat: this.mapCentroid[0], lng: this.mapCentroid[1] },
            zoom: this.defaultZoom,
        });

        // Load data from the CSV file
        this.loadData();
    },

    loadData: function() {
        const _this = this;
        d3.csv(`${this.filePath}.${this.fileType}`)
            .then(function(data) {
                _this.data = data;
                _this.createMarkers();
                    console.log("Data loaded:", this.data);
                    console.log("Markers created:", this.markers.length);
            })
            .catch(function(error) {
                console.error("Error loading data: ", error);
            });
    },

    createMarkers: function() {
        const _this = this;

        this.data.forEach(function(record) {
            const lat = parseFloat(record.latitude);
            const lng = parseFloat(record.longitude);

            if (lat && lng) {
                const marker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map: _this.map,
                    title: record["film title"] || "No Title",
                });

                // Store markers for search functionality
                _this.markers.push(marker);
            }
        });
    },

    doSearch: function() {
        const searchTerm = document.getElementById("search-input").value.toLowerCase();
        const filterType = document.getElementById("search-filter").value;

        this.markers.forEach((marker, index) => {
            const record = this.data[index];
            let fieldValue = "";

            switch (filterType) {
                case "Title":
                    fieldValue = record["film title"] ? record["film title"].toLowerCase() : "";
                    break;
                case "Release Year":
                    fieldValue = record["release year"] ? record["release year"].toString().toLowerCase() : "";
                    break;
                case "Director":
                    fieldValue = record["director"] ? record["director"].toLowerCase() : "";
                    break;
                default:
                    fieldValue = "";
            }
               
                console.log("Search Term:", searchTerm);
                console.log("Filter Type:", filterType);
                console.log("Markers to Filter:", this.markers.length);

marker.setVisible(fieldValue.includes(searchTerm));
        });
    },

    resetSearch: function() {
        document.getElementById("search-input").value = "";
        document.getElementById("search-filter").value = "Title";
        this.markers.forEach(marker => marker.setVisible(true));
    },
};

// Attach SearchableMapLib to the global window object
window.SearchableMapLib = SearchableMapLib;
