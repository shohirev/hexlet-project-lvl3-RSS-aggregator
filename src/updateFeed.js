import axios from 'axios';
import _ from 'lodash';
import proxify from './proxify';
import parseRSS from './RSSParser';

const updateFeed = (url, interval, model, feedId) => {
  axios.get(proxify(url)).then((response) => {
    model.process = 'updating';

    const parsedRssChannel = parseRSS(response.data.contents);

    const downloadedPosts = parsedRssChannel.posts;
    const storedPosts = model.posts[feedId];

    const newPosts = _.differenceBy(downloadedItems, storedItems, 'title');

    if (!_.isEmpty(newItems)) {
      model.items[feedId] = [...newItems, ...storedItems];
      model.process = 'waiting';
    }

    setTimeout(() => {
      updateFeed(url, interval, model, feedId);
    }, interval);
  });
};

export default updateFeed;
