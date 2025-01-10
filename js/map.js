// Initialize the map
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('mapCanvas'), {
        center: { lat: 48.8566, lng: 2.3522 }, // Initial coordinates for Paris
        zoom: 7
    });

    // Fetch CSV and add markers
    fetchCSVAndDisplayMarkers();
}

function fetchCSVAndDisplayMarkers() {
    $.get("data/AQEC Raw Data - Jan 9.csv", function(csvData) {
        var data = $.csv.toObjects(csvData);

        data.forEach(function(row) {
            var lat = parseFloat(row.latitude);
            var lng = parseFloat(row.longitude);
            var title = row.Title;

            if (!isNaN(lat) && !isNaN(lng)) {
                var marker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map: map,
                    title: title
                });

                // Load hover.html template
                $.get("hover.html", function(hoverHtml) {
                    // Create content by filling hover.html with the CSV row data
                    var content = populateHoverHtml(hoverHtml, row);

                    // Create InfoWindow
                    var infoWindow = new google.maps.InfoWindow({ content: content });

                    // Add hover event listeners
                    marker.addListener('mouseover', function() {
                        infoWindow.open(map, marker);
                    });
                    marker.addListener('mouseout', function() {
                        infoWindow.close();
                    });
                });
            }
        });
    });
}

// Function to populate hover.html with data
function populateHoverHtml(hoverHtml, row) {
    // Replace placeholders in hover.html with actual data from the CSV row
    hoverHtml = hoverHtml.replace("{Title}", row["Title"] || "N/A")
                         .replace("{ImageFile}", row["Image File"] || "")
                         .replace("{Description}", row["Description"] || "No description available.")
                         .replace("{ReleaseYear}", row["Release Year"] || "N/A")
                         .replace("{Director}", row["Director"] || "N/A")
                         .replace("{Language}", row["Language"] || "N/A")
                         .replace("{Rights}", row["Rights"] || "N/A");

    return hoverHtml;
}
