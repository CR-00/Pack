const getPointElevation = async (points) => {
  const locations = points
    .map((point) => `${point.lat},${point.lng}`)
    .join("|");
  return await fetch(
    `https://api.open-elevation.com/api/v1/lookup?locations=${locations}`
  )
    .then((response) => response.json())
    .then((data) => {
      return data.results;
    })
    .catch((error) => {
      return [];
    });
};

export default getPointElevation;
