export default (dataString) => {
  const parser = new DOMParser();
  return parser.parseFromString(dataString, 'application/xml');
};
