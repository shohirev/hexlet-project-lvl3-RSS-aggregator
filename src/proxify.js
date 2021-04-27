export default (url) => {
  const proxyUrl = 'https://hexlet-allorigins.herokuapp.com/get';
  const search = `?disableCache=true&url=${url}`;
  return new URL(`${proxyUrl}${search}`);
};
