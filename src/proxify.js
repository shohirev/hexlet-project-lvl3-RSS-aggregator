export default (urlPath) => `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(
  urlPath,
)}`;
