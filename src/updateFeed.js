/* eslint-disable no-param-reassign */

import axios from 'axios';
import differenceBy from 'lodash/differenceBy';
import isEmpty from 'lodash/isEmpty';
import proxify from './proxify';
import parseRSS from './RSSParser';

const updateFeed = (url, model) => {
  axios.get(proxify(url)).then((response) => {
    model.process = 'updating';

    const parsedRssChannel = parseRSS(response.data.contents);

    const downloadedPosts = parsedRssChannel.posts;
    const storedPosts = model.posts;

    const newPosts = differenceBy(downloadedPosts, storedPosts, 'title');

    if (!isEmpty(newPosts)) {
      model.posts = [...newPosts, ...model.posts];
      model.process = 'waiting';
    }
  });

  setTimeout(() => {
    updateFeed(url, model);
  }, model.updateInterval);
};

export default updateFeed;
