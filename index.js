mapboxgl.accessToken =
  "pk.eyJ1Ijoic2hlemFkaGFzc2FuIiwiYSI6ImNrcXdjeDJtbzBrYmgydXFoMHMwY3pmdHgifQ.PwSdUXOY1kbbfM_KakClng";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [47.50806, 34.627971],
  zoom: 2,
});

const flag = document.querySelector(".flag");
var hoveredStateId = null;

document.addEventListener("click", (e) => {
  console.log(e);
});

//"./countries.geojson"
map.on("load", function () {
  map.addSource("states", {
    type: "geojson",
    data: "./countries.geojson",
    generateId: true,
  });

  // The feature-state dependent fill-opacity expression will render the hover effect
  // when a feature's hover state is set to true.
  map.addLayer({
    id: "state-fills",
    type: "fill",
    source: "states",
    layout: {},
    paint: {
      "fill-color": "#627BC1",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.5,
        0.0,
      ],
    },
  });
  /*
  map.addLayer({
    id: "state-borders",
    type: "line",
    source: "states",
    layout: {},
    paint: {
      "line-color": "#627BC1",
      "line-width": 2,
    },
  });
  */

  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.
  var country;
  map.on("mousemove", "state-fills", function (e) {
    map.getCanvas().style.cursor = "pointer";
    if (e.features.length > 0) {
      if (hoveredStateId !== null) {
        map.setFeatureState(
          { source: "states", id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = e.features[0].id;
      map.setFeatureState(
        { source: "states", id: hoveredStateId },
        { hover: true }
      );

      console.log(e.features[0].properties.ADMIN);

      country = e.features[0].properties.ISO_A3.toLowerCase();
      if (country === "NIL") {
      } else {
        // https://flagpedia.net/download/api
        flag.innerHTML = `<img
        src="https://flagcdn.com/h120/${country}.png"
        srcset="https://flagcdn.com/h240/${country}.png 2x"
        height="120"
        alt="">`;
      }
    }
  });

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  map.on("mouseleave", "state-fills", function () {
    map.getCanvas().style.cursor = "";
    if (hoveredStateId !== null) {
      map.setFeatureState(
        { source: "states", id: hoveredStateId },
        { hover: false }
      );
    }
    hoveredStateId = null;
  });
});
