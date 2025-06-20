window.onload = function() {
  initMap();
};

let map;
let marker;

function initMap() {
  const defaultLocation = { lat: 41.9981, lng: 21.4254 }; // Skopje coordinates
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 8
  });

  map.addListener("click", function(event) {
    placeMarkerAndPanTo(event.latLng, map);
  });
}

function placeMarkerAndPanTo(latLng, map) {
  if (marker) {
    marker.setMap(null);
  }

  marker = new google.maps.Marker({
    position: latLng,
    map: map
  });

  document.getElementById("latitude").value = latLng.lat();
  document.getElementById("longitude").value = latLng.lng();
}

// Form submission
const form = document.getElementById('editParkingForm');
form.addEventListener('submit', async function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const address = document.getElementById('address').value;
  const zone = document.getElementById('zone').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  const capacityCar = document.getElementById('capacityCar').value;
  const capacityAdapted = document.getElementById('capacityAdapted').value;
  const latitude = document.getElementById('latitude').value;
  const longitude = document.getElementById('longitude').value;

  if (name && price && address && zone && startTime && endTime && capacityCar && capacityAdapted && latitude && longitude) {
    try {
      // Save data to Firestore
      await db.collection('parkingLots').add({
        name: name,
        price: parseFloat(price),
        address: address,
        zone: zone,
        workingHours: {
          start: startTime,
          end: endTime
        },
        capacity: {
          car: parseInt(capacityCar),
          adapted: parseInt(capacityAdapted)
        },
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        }
      });

      alert("Parking lot details saved successfully!");
      form.reset(); // Reset the form
    } catch (error) {
      console.error("Error saving parking lot: ", error);
      alert("Error saving parking lot details!");
    }
  } else {
    alert("Please fill in all fields!");
  }
});
