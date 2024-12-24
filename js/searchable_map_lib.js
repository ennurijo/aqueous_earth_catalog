var SearchableMapLib = (function () {
  var map, markers, radiusCircle;
  var mapConfig = {};
  var dataRecords = [];
  var infoWindow;

  function initialize(config) {
    mapConfig = config;
    map = L.map('mapCanvas').setView(mapConfig.map_centroid, mapConfig.defaultZoom);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    markers = L.markerClusterGroup();
    radiusCircle = L.circle(mapConfig.map_centroid, {
      radius: mapConfig.defaultRadius,
      color: '#0073e6',
      fillColor: '#0073e6',
      fillOpacity: 0.2
    }).addTo(map);

    infoWindow = L.popup();

    loadData();
  }

  function loadData() {
    var filePath = mapConfig.filePath;
    var fileType = mapConfig.fileType;

    if (fileType === 'csv') {
      Papa.parse(filePath, {
        download: true,
        header: true,
        complete: function (result) {
          dataRecords = result.data;
          processRecords();
        },
        error: function (error) {
          console.error("Error loading CSV:", error);
        }
      });
    } else {
      console.error("Unsupported file type:", fileType);
    }
  }

  function processRecords() {
    dataRecords.forEach(function (record) {
      if (record.Latitude && record.Longitude) {
        var marker = L.marker([record.Latitude, record.Longitude], {
          title: record.Title || "Untitled"
        });

        marker.bindPopup(renderHoverContent(record));
        markers.addLayer(marker);
      }
    });

    map.addLayer(markers);
  }

  function renderHoverContent(record) {
    return `
      <div class="hover-box">
        <strong>${record["Title"] || "N/A"}</strong><br />
        ${record["YouTube Clip ID"] ? `
          <iframe width="200" height="113" 
            src="https://www.youtube.com/embed/${record["YouTube Clip ID"]}" 
            title="YouTube video player" frameborder="0" allowfullscreen></iframe><br />`
          : record["Archive.org Clip ID"] ? `
          <iframe width="200" height="113" 
            src="https://archive.org/embed/${record["Archive.org Clip ID"]}" 
            title="Archive.org video player" frameborder="0" allowfullscreen></iframe><br />`
          : record["Image URL"] ? `
          <img src="${record["Image URL"]}" alt="Image of ${record["Title"]}" 
            style="width: 100px; height: auto; margin-top: 5px;"><br />`
          : ""}
        <strong>Release Year:</strong> ${record["Release Year"] || "N/A"}<br />
        <strong>Location:</strong> ${record["Location"] || "N/A"}<br />
        <strong>Director:</strong> ${record["Director"] || "N/A"}<br />
        ${record["Language"] ? `<strong>Language:</strong> ${record["Language"]}<br />` : ""}
        ${record["Length"] ? `<strong>Length:</strong> ${record["Length"]}<br />` : ""}
        <strong>Description:</strong> ${record["Description"] || "N/A"}<br />
        ${record["Website URL"] ? `
          <strong>Additional Information:</strong> 
          <a href="${record["Website URL"]}" target="_blank">Visit Website</a><br />`
          : ""}
        ${record["Rights"] ? `
          <strong>Rights:</strong> 
          ${record["Rights"] === "public domain" ? `
            <a href="http://rightsstatements.org/vocab/NoC-US/1.0/" target="_blank">Public Domain</a>`
            : record["Rights"] === "non-commercial" ? `
            <a href="http://rightsstatements.org/vocab/NoC-NC/1.0/" target="_blank">Non-Commercial</a>`
            : ""}
          <br />`
          : ""}
      </div>
    `;
  }

  function doSearch() {
    var query = document.getElementById('search-name').value.toLowerCase();
    var address = document.getElementById('search-address').value.toLowerCase();

    markers.clearLayers();

    dataRecords.forEach(function (record) {
      var matchesQuery = record.Title && record.Title.toLowerCase().includes(query);
      var matchesAddress = record.Location && record.Location.toLowerCase().includes(address);

      if (matchesQuery && matchesAddress && record.Latitude && record.Longitude) {
        var marker = L.marker([record.Latitude, record.Longitude], {
          title: record.Title || "Untitled"
        });

        marker.bindPopup(renderHoverContent(record));
        markers.addLayer(marker);
      }
    });

    map.addLayer(markers);
  }

  return {
    initialize: initialize,
    doSearch: doSearch
  };
})();
