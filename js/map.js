const map = L.map('map').setView([48.8566, 2.3522], 13); // Set view to Paris, France

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

d3.csv("data/Hydrography Dec 23 2023 Test.csv")
  .then(function(data) {
    data.forEach(function(d) {
      // Create marker
      var marker = L.marker([d.latitude, d.longitude])
        .addTo(map); 

      // Create popup content using EJS
      var popupContent = ejs.render($('#hover-template').html(), d); 

      // Add hover event listener
      marker.on('mouseover', function(e) {
        this.bindPopup(popupContent).openPopup();
      });

      marker.on('mouseout', function(e) {
        this.closePopup();
      }); 
    });
  })
  .catch(function(error) {
    console.log(error);
  });
