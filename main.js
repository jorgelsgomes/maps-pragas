import './style.css';
import {Feature, Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import HeatmapLayer from 'ol/layer/Heatmap';
import VectorLayer from 'ol/layer/Vector';
import {Point, Polygon} from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import {fromLonLat} from 'ol/proj';
import {Fill, Stroke, Style} from 'ol/style';

const satellite = new TileLayer({
  source: new XYZ({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    crossOrigin: 'anonymous',
    attributions: 'Tiles © Esri'
  })
});

const polygonCoords = [
  [-40.677707, -9.341090],
  [-40.677730, -9.340434],
  [-40.676318, -9.339994],
  [-40.676263, -9.340661],
  [-40.677707, -9.341090]
].map(([lon, lat]) => fromLonLat([lon, lat]));

const polygonFeature = new Feature({
  geometry: new Polygon([polygonCoords])
});

const polygonLayer = new VectorLayer({
  source: new VectorSource({
    features: [polygonFeature]
  }),
  style: new Style({
    fill: new Fill({ color: 'rgba(34, 197, 94, 0.3)' }),
    stroke: new Stroke({ color: 'rgba(22, 163, 74, 1)', width: 2 })
  })
});

const pestPoints = [
  [-40.677520, -9.340980],
  [-40.677230, -9.340820],
  [-40.676960, -9.340660],
  [-40.676780, -9.340380],
  [-40.676640, -9.340120],
  [-40.677120, -9.340250],
  [-40.677460, -9.340410],
  [-40.677300, -9.340690]
].map(([lon, lat]) => {
  const point = new Feature({
    geometry: new Point(fromLonLat([lon, lat]))
  });

  return point;
});

const heatmapLayer = new HeatmapLayer({
  source: new VectorSource({ features: pestPoints }),
  blur: 15,
  radius: 15,
  weight: 0.8,
  gradient: ['#ffff00', '#ff8c00', '#ff0000']
});

const map = new Map({
  target: 'map',
  layers: [satellite, polygonLayer, heatmapLayer],
  view: new View({
    center: fromLonLat([-40.677, -9.3406]),
    zoom: 17,
    minZoom: 15,
    maxZoom: 17
  })
});

const legend = document.getElementById('legend');

map.on('pointermove', (event) => {
  const feature = map.forEachFeatureAtPixel(event.pixel, (hitFeature) => hitFeature, {
    layerFilter: (layer) => layer === polygonLayer
  });

  legend.hidden = !feature;
});

map.getTargetElement().addEventListener('mouseleave', () => {
  legend.hidden = true;
});
