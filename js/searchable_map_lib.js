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
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: this.map,
          title: record.Title ?? "No Title", // Use "Title" column for marker title
          customData: record, // Store the full data record
        });

        // Add an info window to each marker
        const infoWindow = new google.maps.InfoWi
