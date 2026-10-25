// Encoded polyline codec (the format Strava and Google use), shared by the Strava sync
// script and the route map. Plain .mjs so Node can import it without a build step.

/**
 * @param {string} encoded
 * @param {number} [precision] decimal digits kept per coordinate
 * @returns {[number, number][]} [lat, lon] pairs
 */
export function decodePolyline(encoded, precision = 5) {
  const factor = 10 ** precision;
  /** @type {[number, number][]} */
  const points = [];
  let index = 0;
  let lat = 0;
  let lon = 0;
  while (index < encoded.length) {
    for (const axis of [0, 1]) {
      let result = 0;
      let shift = 0;
      let byte;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      const delta = result & 1 ? ~(result >> 1) : result >> 1;
      if (axis === 0) lat += delta;
      else lon += delta;
    }
    points.push([lat / factor, lon / factor]);
  }
  return points;
}

/** @param {number} value */
function encodeValue(value) {
  let rest = value < 0 ? ~(value << 1) : value << 1;
  let out = "";
  while (rest >= 0x20) {
    out += String.fromCharCode((0x20 | (rest & 0x1f)) + 63);
    rest >>= 5;
  }
  return out + String.fromCharCode(rest + 63);
}

/**
 * @param {[number, number][]} points [lat, lon] pairs
 * @param {number} [precision] decimal digits kept per coordinate
 * @returns {string}
 */
export function encodePolyline(points, precision = 5) {
  const factor = 10 ** precision;
  let out = "";
  let prevLat = 0;
  let prevLon = 0;
  for (const [lat, lon] of points) {
    const roundedLat = Math.round(lat * factor);
    const roundedLon = Math.round(lon * factor);
    out += encodeValue(roundedLat - prevLat) + encodeValue(roundedLon - prevLon);
    prevLat = roundedLat;
    prevLon = roundedLon;
  }
  return out;
}
