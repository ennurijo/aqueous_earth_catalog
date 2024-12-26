const SearchableMapLib = {
    map: null,
    markers: [],
    data: [],
    currentSearch: '',

    initialize: function(options) {
        // The path to your CSV file - INPUT YOUR FILE PATH HERE
        this.filePath = options.filePath;  "data/Hydrography Dec 23 2023 Test"
        
        // The file type, which should be "csv" for your case
        this.fileType = options.fileType || "csv"; // You should leave this as "csv" for your CSV file

        // The name of a single record (film title or similar)
        this.recordName = options.recordName;  "Film"

        // The plural name of the record (films or similar)
        this.recordNamePlural = options.recordNamePlural; "Films"

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
                    customData: d  // Store the entire data record for later use in search
                });

                // Create the popup content for each marker
                const popupContent = `
                    <strong>${d["Title"] || "N/A"}</strong><br />
                    Release Year: ${d["Release Year"] || "N/A"}<br />
                    Location: ${d["Location"] || "N/A"}<br />
                    Director: ${d["Director"] || "N/A"}<br />
                    <strong>Description:</strong> ${d["Description"] || "N/A"}<br />
                `;

                const infowindow = new google.maps.InfoWindow({
                    content: popupContent
                });

                // Marker interactions
                marker.addListener('click', function() {
                    infowindow.open(_this.map, marker);
                });

                marker.addListener('mouseover', function() {
                    infowindow.open(_this.map, marker);
                });

                marker.addListener('mouseout', function() {
                    infowindow.close();
                });

                _this.markers.push(marker);  // Add marker to the markers array
            }
        });
    },

    // Function to search the markers based on user input
    doSearch: function() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filterType = document.getElementById('search-filter').value;
    console.log(`Searching for: ${searchTerm} in ${filterType}`);

    this.markers.forEach((marker, index) => {
        const record = this.data[index]; // Get the corresponding data record
        const fieldValue = record[filterType]?.toLowerCase() || ''; // Get the value for the selected filter

        // If the field value contains the search term, show the marker, otherwise hide it
        if (fieldValue.includes(searchTerm)) {
            marker.setVisible(true);
        } else {
            marker.setVisible(false);
        }
    });
}


    // Function to handle the reset button functionality
resetMap: function() {
    // Reset all markers visibility to true (showing all markers)
    this.markers.forEach(marker => {
        marker.setVisible(true);
    });
    }

// Event listener for search button
document.getElementById('btnSearch').addEventListener('click', function() {
    console.log('Search triggered');
    SearchableMapLib.doSearch(); // Trigger the search
});

// Event listener for reset button
document.getElementById('btnReset').addEventListener('click', function() {
    console.log('Reset triggered');
    document.getElementById('search-input').value = '';  // Clear the input
    document.getElementById('search-filter').value = 'Title';  // Reset the filter to default
    SearchableMapLib.resetMap();  // Optionally reset the map view or markers if needed
});
