/* 
  Lazy loading maps and making them responsive is pretty cumbersome,
  so in some cases, e.g. loading tiles on the home page, it's better to
  just use a static image.
*/
export default function coordsToTilePng(
  latitude,
  longitude,
  zoom
) {
  var xtile = Math.round(((longitude + 180) / 360) * (1 << zoom));
  var ytile = Math.round(
    ((1 -
      Math.log(
        Math.tan((latitude * Math.PI) / 180) +
          1 / Math.cos((latitude * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      (1 << zoom)
  );
  return `https://tile-b.openstreetmap.fr/hot/${zoom}/${xtile}/${ytile}.png`;
}

