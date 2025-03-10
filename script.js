async function getData(file) {
  return await fetch(file)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.log(error));
}

async function getMapType() {
  var mapType = document.getElementById("map_select").value;
  var mapData = await getData("./" + mapType + ".json");
  return mapData;
}

function setGeoJson(geojson, MapData) {
  return geojson = L.geoJson(MapData, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup(layer.feature.properties.popupHtml);
      layer.bindTooltip(layer.feature.properties.labelText);
      layer.on("mouseover", function () {
        this.setStyle({
          fillOpacity: 0.75
        });
      });
      layer.on("mouseout", function () {
        this.setStyle({
          fillOpacity: 0.5
        });
      });
    },
    style: function (feature) {
      if(feature.geometry.type === "Polygon") {
        return {
          fillColor: "white",
          weight: 2,
          opacity: 1,
          color: "white",
          fillOpacity: 0.5
        };
      } 
      if(feature.geometry.type === "LineString") {
        return {
          weight: 4,
          opacity: 1,
          color: "white",
          fillOpacity: 0.5
        };
      }
    },
  });
}

addEventListener("DOMContentLoaded", async (event) => {
  var MapData = await getMapType();
  var southWest = L.latLng(51.2635, 0.375),
  northEast = L.latLng(51.2835, 0.435),
  bounds = L.latLngBounds(southWest, northEast);

  const map = L.map("map", {
    maxBounds: bounds,
    minZoom: 14,
    maxZoom: 17,
    preferCanvas: true,
    zoomDelta: 2,
    drawControl: false,
    fullscreenControl: {
      pseudoFullscreen: false,
    },
  }).setView([51.2635, 0.375], 15);

  var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
  }).addTo(map)

  var geojson = setGeoJson(null, MapData).addTo(map);
  var mapSelect = document.getElementById("map_select");

  mapSelect.onchange = async function() {
    var MapData = await getMapType();
    geojson.clearLayers();
    geojson = setGeoJson(geojson, MapData).addTo(map);
  }
});
