
<!-- <script>
    const canvas = document.getElementById('map');
const mapView = new harp.MapView({
   canvas,
   theme: "https://unpkg.com/@here/harp-map-theme@latest/resources/berlin_tilezen_night_reduced.json"
});

// center the camera to New York
mapView.lookAt({
  target: new harp.GeoCoordinates(40.70398928, -74.01319808),
  zoomLevel: 17,
  tilt: 40,
});

const mapControls = new harp.MapControls(mapView);
const ui = new harp.MapControlsUI(mapControls);
canvas.parentElement.appendChild(ui.domElement);

mapView.resize(window.innerWidth, window.innerHeight);
window.onresize = () => mapView.resize(window.innerWidth, window.innerHeight);

const vectorTileDataSource = new harp.VectorTileDataSource({
   authenticationCode: 'R7QnFcbjcRgWFp9CVCuSfSeaRaSldqkMcSfDFme6tJc',
});
mapView.addDataSource(vectorTileDataSource);
</script> -->

<!-- <head>
    <style>
       body, html { border: 0; margin: 0; padding: 0}
       #map { height: 100vh; width: 100vw; }
    </style>
    <script src="https://unpkg.com/three/build/three.min.js"></script>
    <script src="https://unpkg.com/@here/harp.gl/dist/harp.js"></script>
 </head>
 <body>
    <canvas id="map"></canvas>
    <script src="index.js"></script>
 </body> -->