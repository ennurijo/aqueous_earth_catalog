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
            var lat = parseFloat(row.latitude);  // Assuming the CSV column is called 'Latitude'
            var lng = parseFloat(row.longitude); // Assuming the CSV column is called 'Longitude'
            var title = row.Title;  // Assuming the CSV column is called 'Title'

            if (!isNaN(lat) && !isNaN(lng)) {
                var marker = new google.maps.Marker({
                    position: { lat: lat, lng: lng },
                    map: map,
                    title: title // Set the title to be displayed when the marker is hovered over
                });

           // Create an info window with the title
                var infoWindow = new google.maps.InfoWindow({
                    content: `<h3>${title}</h3>`
                });

                // Show the info window when mouse is over the marker
                marker.addListener('mouseover', function() {
                    infoWindow.open(map, marker);
                });

                // Close the info window when mouse leaves the marker
                marker.addListener('mouseout', function() {
                    infoWindow.close();
                });
            }
        });
    });
}
