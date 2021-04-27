import onChange from 'on-change';
import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
import validate from './validator';
import render from './render';
import resources from './locales/index';
import proxify from './proxify';
import parseRSS from './RSSParser';
import update from './updateFeed';

export default () => {
  const i18nextInstance = i18next.createInstance();
  return i18nextInstance
    .init({
      lng: 'ru',
      resources,
    })
    .then((translate) => {
      const state = {
        process: 'initializing',
        feeds: [],
        posts: {},
        viewedPosts: [],
        error: null,
        uiState: {
          input: '',
          modalWindow: {
            title: '',
            body: '',
            link: '',
          },
        },
      };

      const watchedState = onChange(state, (changedStateSection, changedStateValue) => {
        const renderingProcesses = ['initializing', 'processingRequest', 'waiting'];

        if (changedStateSection === 'process' && _.includes(renderingProcesses, changedStateValue)) {
          render(watchedState, translate);
        }
      });

      render(watchedState, translate);

      const form = document.getElementById('rss-form');

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        watchedState.process = 'processingRequest';

        const rssChannelUrl = document.getElementById('rss-input').value;

        validate(rssChannelUrl, watchedState);

        axios
          .get(proxify(rssChannelUrl))
          .then((response) => response.data.contents)
          .catch(() => {
            watchedState.error = 'networkError';
            watchedState.uiState.input = rssChannelUrl;
            watchedState.process = 'waiting';
          })
          .then((rssChannel) => {
            const parsedRssChannel = parseRSS(rssChannel);
            const id = _.uniqueId();
            const { title, description, posts } = parsedRssChannel;

            watchedState.error = null;
            watchedState.feeds = [{
              id, url: rssChannelUrl, title, description,
            }, ...watchedState.feeds];
            watchedState.posts = _.merge({ [id]: posts }, watchedState.posts);
            watchedState.uiState.input = '';
            watchedState.process = 'waiting';

            setTimeout(() => {
              update(rssChannelUrl, 5000, watchedState, id);
            }, 5000);
          })
          .catch(() => {
            watchedState.error = 'parsingError';
            watchedState.uiState.input = rssChannelUrl;
            watchedState.process = 'waiting';
          });
      });
    });
};
