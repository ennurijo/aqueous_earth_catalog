var SearchableMapLib = SearchableMapLib || {};
var SearchableMapLib = {

  // parameters to be defined on initialize() 
  map_centroid: [],
  defaultZoom: "",
  filePath: '',
  fileType: '',
  csvOptions: '',
  listOrderBy: '',
  recordName: '',
  recordNamePlural: '',
  debug: false,

  // internal properties
  radius: '',
  csvData: null,
  geojsonData: null,
  currentResults: null,
  currentResultsLayer: null,
  currentPinpoint: null,
  lastClickedLayer: null,

 initialize: function(options){
    options = options || {};

    SearchableMapLib.map_centroid = options.map_centroid || [48.8575, 2.3514]; // Default to Paris, France
    SearchableMapLib.defaultZoom = options.defaultZoom || 13,
    SearchableMapLib.filePath = options.filePath || "data/Hydrography Dec 23 2023 Test",
    SearchableMapLib.fileType = options.fileType || "csv",
    SearchableMapLib.csvOptions = options.csvOptions || {separator: ',', delimiter: '"'},
    SearchableMapLib.listOrderBy = options.listOrderBy || "",
    SearchableMapLib.recordName = options.recordName || "result",
    SearchableMapLib.recordNamePlural = options.recordNamePlural || "results",
    SearchableMapLib.radius = options.defaultRadius || 1610,
    SearchableMapLib.debug = options.debug || false
    
    if (SearchableMapLib.debug)
      console.log('debug mode is on');

  //reset filters
    $("#search-input").val(SearchableMapLib.convertToPlainString($.address.parameter('address')));

    var loadRadius = SearchableMapLib.convertToPlainString($.address.parameter('radius'));
    if (loadRadius != "") 
        $("#search-radius").val(loadRadius);
    else 
        $("#search-radius").val(SearchableMapLib.radius);
     

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

    doSearch() {
  console.log('doSearch called');
  const searchTerm = document.getElementById("search-input").value.toLowerCase();
  const filterType = document.getElementById("search-filter").value;

  // Loop over the markers and the data (CSV data)
  this.markers.forEach((marker, index) => {
    const record = this.data[index]; // Get the corresponding data record from CSV
    let fieldValue = ''; // Will store the value to search on

    // Determine which field to search based on the filter type
    switch (filterType) {
      case 'Title':
        fieldValue = record.Title?.toLowerCase() || ''; // Match Title
        break;
      case 'Release Year':
        fieldValue = record['Release Year']?.toString() || ''; // Match Release Year (convert to string for comparison)
        break;
      case 'Director':
        fieldValue = record.Director?.toLowerCase() || ''; // Match Director
        break;
      default:
        fieldValue = ''; // Default to empty string if filter is invalid
    }

    // If the field value contains the search term, show the marker; otherwise, hide it
    // ** This logic can be replaced by calling the searchMarkers function**
    // if (fieldValue.includes(searchTerm)) {
    //   marker.setVisible(true); // Show marker
    // } else {
    //   marker.setVisible(false); // Hide marker
    // }
  });

  // Call the searchMarkers function with the searchTerm
  this.searchMarkers(searchTerm);
},

searchMarkers: function(searchTerm) {
  this.markers.forEach(marker => {
    const markerTitle = marker.getTitle().toLowerCase();
    if (markerTitle.includes(searchTerm)) {
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
