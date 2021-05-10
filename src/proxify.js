export default (url) => {
  const proxyUrl = new URL('https://hexlet-allorigins.herokuapp.com/get');
  proxyUrl.searchParams.set('disableCache', true);
  proxyUrl.searchParams.set('url', url);
  return proxyUrl.toString();
};
