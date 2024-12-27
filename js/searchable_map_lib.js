var SearchableMapLib = {
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
    try {
      this.map = new google.maps.Map(document.getElementById("mapCanvas"), {
        center: options.mapCentroid ?? { lat: 48.8575, lng: 2.3514 }, // Default to Paris
        zoom: options.defaultZoom ?? 13,
      });
      console.log("Google Map initialized successfully:", this.map);
    } catch (error) {
      console.error("Error initializing Google Map:", error);
    }

    // Load data from the CSV file
    this.loadData();
  },

  // Load the CSV data and process it into markers
  loadData() {
    console.log(`Loading data from: ${this.filePath}.${this.fileType}`);
    d3.csv(`${this.filePath}.${this.fileType}`)
      .then((data) => {
        console.log("Data loaded successfully:", data);
        this.data = data; // Save the loaded data
        this.createMarkers(); // Create markers for the map
      })
      .catch((error) => {
        console.error("Error loading CSV data:", error);
      });
  },

  // Create markers for the map based on the loaded data
  createMarkers() {
    if (!this.data || this.data.length === 0) {
      console.warn("No data available to create markers.");
      return;
    }

    
