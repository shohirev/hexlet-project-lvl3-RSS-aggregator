import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
import i18next from 'i18next';
import render from './render.js';
import resources from './locales/index.js';
import isRSS from './validationRSSURL.js';
import proxify from './proxify.js';
import parseRSS from './RSSParser.js';
import update from './update.js';

const app = () => {
  const state = {
    process: 'waiting',
    validation: {},
    updates: {},
    feeds: [],
    loadedFeeds: [],
  };

  const watchedState = onChange(state, (changedStateSection, value, previousValue) => {
    if (changedStateSection === 'process') {
      const currentProcess = value;

      switch (currentProcess) {
        case 'handling validation error':
          render.validationError(watchedState);
          watchedState.process = 'waiting';
          break;
        case 'handling network error':
          render.networkError(watchedState);
          watchedState.process = 'waiting';
          break;
        case 'handling parsing error':
          render.parsingError();
          watchedState.process = 'waiting';
          break;
        case 'handling new feed':
          render.newFeed(watchedState);
          watchedState.process = 'waiting';
          break;
        case 'handling updates':
          render.updates(watchedState);
          watchedState.process = 'waiting';
          break;
        default:
          render.waiting();
      }
    }
  });

  i18next.init({
    lng: 'en',
    resources: resources,
  }, render.page);

  const form = document.getElementById('rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    document.querySelector('button[name=addChannelBtn]').classList.toggle('disabled');

    const userUrl = document.getElementById('rss-input').value;

    if (watchedState.loadedFeeds.includes(userUrl)) {
      watchedState.validation.state = false;
      watchedState.validation.error = 'duplicationUrlError';
      watchedState.process = 'handling validation error';
      return;
    }

    if (!isRSS(userUrl)) {
      watchedState.validation.state = false;
      watchedState.validation.error = 'invalidRssUrlError';
      watchedState.process = 'handling validation error';
      return;
    }

    watchedState.validation.state = true;
    watchedState.validation.error = null;

    axios.get(proxify(userUrl))
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        watchedState.networkError = err.message;
        watchedState.process = 'handling network error';
      })
      .then((data) => {
        const parsedData = parseRSS(data);

        const title = parsedData.querySelector('channel title').textContent;

        const description = parsedData.querySelector('channel description').textContent;

        const link = parsedData.querySelector('channel link').textContent;

        const items = Array.from(parsedData.querySelectorAll('item'), itemNode => {
          const itemData = {
            title: itemNode.querySelector('title').textContent,
            description: itemNode.querySelector('description').textContent,
            link: itemNode.querySelector('link').textContent
          };
          return itemData;
        });

        const newFeed = {title, description, link, items};
        watchedState.feeds.push(newFeed);

        watchedState.loadedFeeds.push(userUrl);
        watchedState.process = 'handling new feed';
        setTimeout(() => {
          update(userUrl, 5000, watchedState);
        }, 5000);
      })
      .catch((parseErr) => {
        watchedState.process = 'handling parsing error';
      });
    });
};

export default app;