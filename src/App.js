import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';

const mbxGeocoder = mbxGeocoding({
  accessToken:
    process.env.REACT_APP_MAPBOX_API,
});

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API;

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [address, setAddress] = useState('');
  const [query, setQuery] = useState('New York, USA');

  useEffect(() => {
    const fetchData = async () => {
      const geoData = await mbxGeocoder
        .forwardGeocode({
          query: query,
          limit: 1,
        })
        .send();
      // console.log(geoData.body.features[0].geometry);
      const coordinates = geoData.body.features[0].geometry.coordinates;
      // console.log(coordinates[0])
      setLng(coordinates[0]);
      setLat(coordinates[1]);

      // if (!map.current) return; // initialize map only once
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: zoom,
      });

      map.current.addControl(new mapboxgl.NavigationControl());

      new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 30 }).setHTML(`<p>${address}</p>`)
        )
        .addTo(map.current);
    };

    fetchData();
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    setQuery(address);
    setAddress('');
  };

  // useEffect(() => {
  //   if (!map.current) return; // wait for map to initialize
  //   map.current.on('move', () => {
  //     setLng(map.current.getCenter().lng.toFixed(4));
  //     setLat(map.current.getCenter().lat.toFixed(4));
  //     setZoom(map.current.getZoom().toFixed(2));
  //   });
  // });

  return (
    <div>
      <div className='sidebar'>
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className='map-container' />
      <div className='search-bar'>
        <form onSubmit={handleSubmit}>
          <input
            placeholder='Search...'
            type='text'
            id='address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button type='submit'>Search</button>
        </form>
      </div>
    </div>
  );
}
