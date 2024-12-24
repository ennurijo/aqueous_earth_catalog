const SearchableMapLib = {
    map: null,
    markers: [],
    data: [],
    currentSearch: '',

    initialize: function(options) {
        this.filePath = options.filePath;
        this.fileType = options.fileType;
        this.recordName = options.recordName;
        this.recordNamePlural = options.recordNamePlural;
        this.mapCentroid = options.map_centroid || [48.8575, 2.3514]; // Default to Paris, France
        this.defaultZoom = options.defaultZoom || 13;
        this.defaultRadius = options.defaultRadius || 1610; // Default radius in meters
        this.debug = options.debug || false;

        // Create the map
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: this.mapCentroid[0], lng: this.mapCentroid[1] },
            zoom: this.defaultZoom
        });

        // Load CSV data
        this.loadData();
    },

    loadData: function() {
        const _this = this;
        d3.csv(`${this.filePath}.${this.fileType}`)
            .then(function(data) {
                _this.data = data;
                _this.createMarkers();
            })
            .catch(function(error) {
                console.error("Error loading data: ", error);
            });
    },

    createMarkers: function() {
        const _this = this;
        this.data.forEach(function(d) {
            const lat = parseFloat(d.latitude);
            const lng = parseFloat(d.longitude);

            if (lat && lng) {
                const marker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map: _this.map,
                    title: d["film title"] || "No Title"
                });

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

                marker.addListener('click', function() {
                    infowindow.open(_this.map, marker);
                });

                marker.addListener('mouseover', function() {
                    infowindow.open(_this.map, marker);
                });

                marker.addListener('mouseout', function() {
                    infowindow.close();
                });

                _this.markers.push(marker);
            }
        });
    },

    doSearch: function() {
        const searchTerm = document.getElementById('search-address').value.toLowerCase();
        this.currentSearch = searchTerm;

        // Filter markers based on search term (you can add more fields here as necessary)
        this.markers.forEach(marker => {
            const title = marker.getTitle().toLowerCase();
            if (title.includes(searchTerm)) {
                marker.setVisible(true);
            } else {
                marker.setVisible(false);
            }
        });
    }
};
