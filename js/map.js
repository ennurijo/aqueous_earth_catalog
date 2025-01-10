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

                // Create content for the info window
                var content = createInfoWindowContent(row);

                // Create InfoWindow
                var infoWindow = new google.maps.InfoWindow({ content: content });

                // Add hover event listeners
                marker.addListener('mouseover', function() {
                    infoWindow.open(map, marker);
                });
                marker.addListener('mouseout', function() {
                    infoWindow.close();
                });
            }
        });
    });
}

// Create the content for the info window
function createInfoWindowContent(row) {
    var content = `
        <div class="card mb-3">
            <h3 class="card-header">${row["Title"] || "N/A"}</h3>
            <div class="card-body">
                
                <!-- Always show the image -->
                <div id="image-container">${generateImage(row)}</div>
                

                <!-- Description -->
                <p class="card-text">${row["Description"] || "No description available."}</p>
            </div>
            
            <!-- Additional info -->
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Release Year: ${row["Release Year"] || "N/A"}</li>
                <li class="list-group-item">Director: ${row["Director"] || "N/A"}</li>
                <li class="list-group-item">Language: ${row["Language"] || "N/A"}</li>
            </ul>

            <div class="card-footer text-muted">
                Rights: ${row["Rights"] || "N/A"}
            </div>
        </div>
    `;
    return content;
}

// Generate the image (always shown)
function generateImage(row) {
    if (row["Image File"]) {
        return `<img src="${row["Image File"]}" alt="Image of ${row["Title"]}" style="width: 100px; height: auto; margin-top: 5px;">`;
    }
    return '';  // If no image, return empty string

}
