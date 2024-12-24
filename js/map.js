$(window).resize(function () {
  var h = $(window).height(),
      offsetTop = 125; // Calculate the top offset
  $('#mapCanvas').css('height', (h - offsetTop));
}).resize();

$(function() {
  // Initialize SearchableMapLib with your specific configuration
  SearchableMapLib.initialize({
    filePath: 'data/Hydrography Dec 23 Test', // Ensure the file path is correct
    fileType: 'csv', // Expecting a CSV file
    recordName: 'film title',
    recordNamePlural: 'film titles',
    map_centroid: [-48.87661025066399, -123.39330647791094], // Center of the map
    defaultZoom: 11,
    defaultRadius: 1610, // Radius in meters
    debug: false
  });

  // Set up Google Maps Places Autocomplete
  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('search-address'));

  // Event handler for search button
  $('#btnSearch').click(function() {
    if ($('#mapCanvas').is(":visible")) {
      SearchableMapLib.doSearch();
    } else {
      toggleViewMode('map');
      SearchableMapLib.doSearch();
    }
  });

  // Checkbox filter event
  $(':checkbox').click(function() {
    SearchableMapLib.doSearch();
  });

  // Radio button filter event
  $(':radio').click(function() {
    SearchableMapLib.doSearch();
  });

  // View mode toggle (Map/List)
  $('#btnViewMode').click(function() {
    if ($('#mapCanvas').is(":visible")) {
      toggleViewMode('list');
    } else {
      toggleViewMode('map');
    }
  });

  // Search with Enter key
  $("#search-address, #search-name").keydown(function(e) {
    if (e.key === "Enter") {
      $('#btnSearch').click();
      return false;
    }
  });

  // Modal close event
  $(".close-btn").on('click', function() {
    $.address.parameter('modal_id', null);
  });

  // Format address for display (optional, based on your data structure)
  function formatAddress(prop) {
    return `${prop["Street1"] || ''} ${prop["Street2"] || ''} ${prop["City"] || ''} ${prop["State"] || ''}`;
  }

  // Utility function to toggle between map and list views
  function toggleViewMode(viewMode) {
    if (viewMode === 'map') {
      $('#btnViewMode').html("<i class='fa fa-list'></i> List view");
      $('#listCanvas').hide();
      $('#mapCanvas').show();
    } else if (viewMode === 'list') {
      $('#btnViewMode').html("<i class='fa fa-map-marker'></i> Map view");
      $('#mapCanvas').hide();
      $('#listCanvas').show();
    }
  }

  // Log analytics if `analytics_lib.js` is in use
  if (typeof AnalyticsLib !== 'undefined') {
    AnalyticsLib.logEvent('map_initialization', {
      timestamp: new Date().toISOString(),
      initialized: true
    });
  }

  // Ensure CSV-to-GeoJSON conversion works if needed
  if (typeof CSVtoGeoJSON !== 'undefined') {
    SearchableMapLib.on('dataLoaded', function(data) {
      // Use CSVtoGeoJSON if raw CSV is loaded
      if (data.format === 'csv') {
        const geoJsonData = CSVtoGeoJSON.convert(data.rawData);
        SearchableMapLib.loadGeoJSON(geoJsonData);
      }
    });
  }
});
