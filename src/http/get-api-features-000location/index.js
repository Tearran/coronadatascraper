const arc = require('@architect/functions');

// eslint-disable-next-line
const featureCollection = require('./dist/features.json');
// eslint-disable-next-line
const locationMap = require('./dist/location-map.json');
// eslint-disable-next-line
const skinnyLocations = require('./dist/skinnyLocations.json');

// eslint-disable-next-line
const { handle404 } = require('@architect/views/lib/middleware');
// eslint-disable-next-line
const { filterFeatureCollectionByLocations } = require('@architect/views/lib/features');
// eslint-disable-next-line
const { getChildLocations } = require('@architect/views/lib/geography');

async function route(req) {
  const { location } = req;
  const level = req.queryStringParameters.level || location.level;
  const childLocations = getChildLocations(location, Object.values(skinnyLocations), level);
  const subFeatureCollection = filterFeatureCollectionByLocations(featureCollection, childLocations);

  return {
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'application/json; charset=utf8'
    },
    body: JSON.stringify(subFeatureCollection)
  };
}

exports.handler = arc.http.async(handle404(locationMap), route);