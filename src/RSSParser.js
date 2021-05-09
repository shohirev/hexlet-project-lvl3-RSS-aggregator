export default (rssChannel) => {
  const parser = new DOMParser();
  const parsedRssChannel = parser.parseFromString(rssChannel, 'application/xml');

  const title = parsedRssChannel.querySelector('channel title').textContent;
  const description = parsedRssChannel.querySelector('channel description').textContent;

  const posts = Array.from(parsedRssChannel.querySelectorAll('item'), (itemNode) => {
    const post = {
      title: itemNode.querySelector('title').textContent,
      description: itemNode.querySelector('description').textContent,
      link: itemNode.querySelector('link').textContent,
      isViewed: false,
    };
    return post;
  });

  const rssData = {
    title,
    description,
    posts,
  };

  return rssData;
};
