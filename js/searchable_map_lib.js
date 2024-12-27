const SearchableMapLib = {
    map: null,
    markers: [],
    data: [],
    filePath: "data/Hydrography Dec 23 2023 Test", // Path to the CSV file
    fileType: "csv", // File type (CSV)
    recordName: "Film",
    recordNamePlural: "Films",

    // Initialize the map and load data
    initialize: function(options = {}) {
        // Update options if provided
        this.filePath = options.filePath || this.filePath;
        this.fileType = options.fileType || this.fileType;

        // Initialize Google Maps
        this.map = new google.maps.Map(document.getElementById("mapCanvas"), {
            center: options.mapCentroid || { lat: 48.8575, lng: 2.3514 }, // Default to Paris
            zoom: options.defaultZoom || 13
        });

        // Load data from the CSV file
        this.loadData();
    },

    // Load the CSV data and process it into markers
    loadData: function() {
        const _this = this;
        d3.csv(`${this.filePath}.${this.fileType}`)
            .then(function(data) {
                _this.data = data; // Save the loaded data
                _this.createMarkers(); // Create markers for the map
            })
            .catch(function(error) {
                console.error("Error loading data:", error);
            });
    },

    // Create markers for the map based on the loaded data
    createMarkers: function() {
        const _this = this;

        this.data.forEach(function(record) {
            const lat = parseFloat(record.latitude);
            const lng = parseFloat(record.longitude);

            if (lat && lng) {
                const marker = new google.maps.Marker({
                    position: { lat, lng },
                    map: _this.map,
                    title: record["Title"] || "No Title", // Use "Title" column for marker title
                    customData: record // Store the full data record
                });

                // Add an info window to each marker
                const infoWindow = new google.maps.InfoWindow({
                    content: `<strong>${record["Title"] || "N/A"}</strong><br/>
                              Release Year: ${record["Release Year"] || "N/A"}<br/>
                              Location: ${record["Location"] || "N/A"}<br/>
                              Director: ${record["Director"] || "N/A"}`
                });

                // Add event listeners for marker interactions
                marker.addListener("click", function() {
                    infoWindow.open(_this.map, marker);
                });

                _this.markers.push(marker); // Save marker to the markers array
            }
        });
    },

    // Perform a search on the markers
    doSearch: function() {
        console.log("doSearch called");
        const searchTerm = document.getElementById("search-input").value.toLowerCase();
        const filterType = document.getElementById("search-filter").value;

        // Reset if search term is empty
        if (!searchTerm) {
            console.log("Empty search term, resetting markers.");
            this.resetMap();
            return;
        }

        // Filter markers based on search term and filter type
        this.markers.forEach((marker, index) => {
            const record = this.data[index]; // Get the corresponding record
            let fieldValue = "";

            switch (filterType) {
                case "Title":
                    fieldValue = record["Title"]?.toLowerCase() || "";
                    break;
                case "Release Year":
                    fieldValue = record["Release Year"]?.toString() || "";
                    break;
                case "Location":
                    fieldValue = record["Location"]?.toLowerCase() || "";
                    break;
                case "Director":
                    fieldValue = record["Director"]?.toLowerCase() || "";
                    break;
                default:
                    console.warn("Invalid filter type.");
                    return;
            }

            // Show or hide markers based on the match
            marker.setVisible(fieldValue.includes(searchTerm));
        });
    },

    // Reset all markers to visible and clear inputs
    resetMap: function() {
        this.markers.forEach(marker => marker.setVisible(true));
        document.getElementById("search-input").value = "";
        document.getElementById("search-filter").value = "Title";
        console.log("Map reset complete.");
    }
};

// Attach event listeners to buttons
document.addEventListener("DOMContentLoaded", function() {
    const btnSearch = document.getElementById("btnSearch");
    const btnReset = document.getElementById("btnReset");

    // Initialize the map library
    SearchableMapLib.initialize();

    // Attach button actions
    if (btnSearch) {
        btnSearch.addEventListener("click", function() {
            SearchableMapLib.doSearch();
        });
    }

    if (btnReset) {
        btnReset.addEventListener("click", function() {
            SearchableMapLib.resetMap();
        });
    }
});
