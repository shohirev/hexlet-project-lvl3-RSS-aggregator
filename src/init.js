import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
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
        items: {},
        loadedFeeds: [],
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

        const validationSchema = yup
          .string()
          .notOneOf(watchedState.loadedFeeds, 'duplicationUrlError')
          .matches(
            /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([w#!:.?+=&%@!]))?/,
            'invalidRssUrlError',
          );

        try {
          validationSchema.validateSync(rssChannelUrl);
        } catch (validationError) {
          const error = validationError.errors[0];
          watchedState.error = error;
          watchedState.uiState.input = rssChannelUrl;
          watchedState.process = 'waiting';
          return;
        }

        axios
          .get(proxify(rssChannelUrl))
          .then((response) => response.data)
          .catch(() => {
            watchedState.error = 'networkError';
            watchedState.uiState.input = rssChannelUrl;
            watchedState.process = 'waiting';
          })
          .then((data) => {
            const parsedRssChannel = parseRSS(data.contents);

            const id = _.uniqueId();
            const title = parsedRssChannel.querySelector('channel title')
              .textContent;
            const description = parsedRssChannel.querySelector(
              'channel description',
            ).textContent;
            const link = parsedRssChannel.querySelector('channel link')
              .textContent;

            const currentFeedItems = Array.from(
              parsedRssChannel.querySelectorAll('item'),
              (itemNode) => {
                const item = {
                  guid: itemNode.querySelector('guid').textContent,
                  title: itemNode.querySelector('title').textContent,
                  description: itemNode.querySelector('description')
                    .textContent,
                  link: itemNode.querySelector('link').textContent,
                };
                return item;
              },
            );

            watchedState.error = null;
            watchedState.loadedFeeds = [...watchedState.loadedFeeds, rssChannelUrl];
            watchedState.feeds = [{
              id, title, description, link,
            }, ...watchedState.feeds];
            watchedState.items = _.merge({ [id]: currentFeedItems }, watchedState.items);
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
