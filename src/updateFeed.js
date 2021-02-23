import axios from 'axios';
import _ from 'lodash';
import proxify from './proxify';
import parseRSS from './RSSParser';

const updateFeed = (url, interval, model, feedId) => {
  axios.get(proxify(url)).then((response) => {
    model.process = 'updating';

    const parsedRssChannel = parseRSS(response.data.contents);
    const downloadedItems = Array.from(
      parsedRssChannel.querySelectorAll('item'),
      (itemNode) => {
        const item = {
          guid: itemNode.querySelector('guid').textContent,
          title: itemNode.querySelector('title').textContent,
          description: itemNode.querySelector('description').textContent,
          link: itemNode.querySelector('link').textContent,
        };
        return item;
      },
    );
    const storedItems = model.items[feedId];

    const newItems = _.differenceBy(downloadedItems, storedItems, 'title');

    if (!_.isEmpty(newItems)) {
      model.items[feedId] = [...newItems, ...storedItems];
      model.process = 'processingUpdates';
    }

    setTimeout(() => {
      updateFeed(url, interval, model, feedId);
    }, interval);
  });
};

export default updateFeed;
