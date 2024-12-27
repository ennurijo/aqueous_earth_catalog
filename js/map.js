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
    $.get("data/Hydrography Dec 23 Test.csv", function(csvData) {
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

                // Optionally add an info window that shows the title when clicked
                var infoWindow = new google.maps.InfoWindow({
                    content: `<h3>${title}</h3>`
                });

                marker.addListener('click', function() {
                    infoWindow.open(map, marker);
                });
            }
        });
    });
}
