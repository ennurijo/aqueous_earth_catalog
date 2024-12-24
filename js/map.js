// Initialize the map when the page is loaded
function initMap() {
    // Create the map centered around Paris, France
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 48.8575, lng: 2.3514 },  // Coordinates for Paris
        zoom: 13
    });

    // Load the CSV data
    d3.csv("data/Hydrography Dec 23 2023 Test.csv")
        .then(function(data) {
            // Loop through each data point and create a marker
            data.forEach(function(d) {
                const lat = parseFloat(d.latitude);  // Assuming latitude is in the CSV
                const lng = parseFloat(d.longitude); // Assuming longitude is in the CSV

                if (lat && lng) { // Ensure valid coordinates
                    const marker = new google.maps.Marker({
                        position: { lat: lat, lng: lng },
                        map: map,
                        title: d["film title"] || "No Title" // Title from CSV data
                    });

                    // Create a content string for the popup (you can use EJS here if you want dynamic content)
                    const popupContent = `
                        <strong>${d["Title"] || "N/A"}</strong><br />
                        Release Year: ${d["Release Year"] || "N/A"}<br />
                        Location: ${d["Location"] || "N/A"}<br />
                        Dir
