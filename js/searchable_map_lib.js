const SearchableMapLib = {
  map: null,
  markers: [],
  data: [],
  filePath: "data/Hydrography Dec 23 2023 Test", // Path to the CSV file
  fileType: "csv", // File type (CSV)
  recordName: "Film",
  recordNamePlural: "Films",
  
  // Initialize the map and load data
  initialize(options = {}) {
    // Update options if provided
    this.filePath = options.filePath ?? this.filePath;
    this.fileType = options.fileType ?? this.fileType;

    // Initialize Google Maps
    this.map = new google.maps.Map(document.getElementById("mapCanvas"), {
      center: options.mapCentroid ?? { lat: 48.8575, lng: 2.3514 }, // Default to Paris
      zoom: options.defaultZoom ?? 13,
    });

    // Load data from the CSV file
    this.loadData();
  },

  // Load the CSV data and process it into markers
  loadData() {
    d3.csv(`${this.filePath}.${this.fileType}`)
      .then((data) => {
        this.data = data; // Save the loaded data
        this.createMarkers(); // Create markers for the map
      })
      .catch((error) => console.error("Error loading data:", error));
  },

  // Create markers for the map based on the loaded data
  createMarkers() {
    this.data.forEach((record) => {
      const lat = parseFloat(record.latitude);
      const lng = parseFloat(record.longitude);

      if (lat && lng) {
const { AdvancedMarkerElement } = google.maps.marker;

const marker = new AdvancedMarkerElement({
  position: { lat, lng },
  map: this.map,
  title: record.Title ?? "No Title",
});

      // Add an info window to each marker
        const infoWindow = new google.maps.InfoWindow({
          content: `<strong>${record.Title ?? "N/A"}</strong><br/>
                    Release Year: ${record["Release Year"] ?? "N/A"}<br/>
                    Location: ${record.Location ?? "N/A"}<br/>
                    Director: ${record.Director ?? "N/A"}`,
        });

        // Add event listeners for marker interactions
        marker.addListener("click", () => infoWindow.open(this.map, marker));

        this.markers.push(marker); // Save marker to the markers array
      }
    });
  },

  // Perform a search on the markers
  doSearch() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    const filterType = document.getElementById("search-filter").value;

    // Reset if search term is empty
    if (!searchTerm) {
      this.resetMap();
      return;
    }

    // Filter markers based on search term and filter type
    this.markers.forEach((marker, index) => {
      const record = this.data[index]; // Get the corresponding record
      let fieldValue = "";

      switch (filterType) {
        case "Title":
          fieldValue = record.Title?.toLowerCase() ?? "";
          break;
        case "Release Year":
          fieldValue = record["Release Year"]?.toString() ?? "";
          break;
        case "Location":
          fieldValue = record.Location?.toLowerCase() ?? "";
          break;
        case "Director":
          fieldValue = record.Director?.toLowerCase() ?? "";
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
  resetMap() {
    this.markers.forEach((marker) => marker.setVisible(true));
    document.getElementById("search-input").value = "";
    document.getElementById("search-filter").value = "Title";
  },
};

// Attach event listeners to buttons
document.addEventListener("DOMContentLoaded", () => {
  const btnSearch = document.getElementById("btnSearch");
  const btnReset = document.getElementById("btnReset");

  // Initialize the map library
  SearchableMapLib.initialize();

  // Attach button actions
  btnSearch?.addEventListener("click", () => SearchableMapLib.doSearch());
  btnReset?.addEventListener("click", () => SearchableMapLib.resetMap());
});
