import axios from 'axios';
import proxify from './proxify.js';
import parseRSS from './RSSParser.js';

const updateFeed = (feedUrl, time, model) => {
  axios.get(proxify(feedUrl))
    .then((response) => {
      const downloadedRss = parseRSS(response.data);
      const downloadedFeedTitle = downloadedRss.querySelector('channel title').textContent;
      const updatingFeed = _.find(model.feeds, (feed) => feed.title === downloadedFeedTitle);
      const updatingPostsTitles = updatingFeed.items.map((post) => post.title);
        
      const downloadedPosts = Array.from(downloadedRss.querySelectorAll('item'), itemNode => {
        const itemData = {
          title: itemNode.querySelector('title').textContent,
          description: itemNode.querySelector('description').textContent,
          link: itemNode.querySelector('link').textContent
        };
        return itemData;
      });

      const newPosts = downloadedPosts.filter((post) => !updatingPostsTitles.includes(post.title));

      if (!_.isEmpty(newPosts)) {
        updatingFeed.items = [...newPosts, ...updatingFeed.items];
        model.updates.feedTitle = updatingFeed.title;
        model.process = 'handling updates';
      }

      setTimeout(() => {
        updateFeed(feedUrl, time, model);
      }, time);
    });
};

export default updateFeed;