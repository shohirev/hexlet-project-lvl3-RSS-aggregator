import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import View from './View';
import resources from './locales/index';
import proxify from './proxify';
import parseRSS from './RSSParser';
import update from './updateFeed';

export default () => {
  const view = new View();
  const i18nextInstance = i18next.createInstance();
  return i18nextInstance.init(
    {
      lng: 'ru',
      resources,
    })
  .then((t) => {
    view.init(t);
    view.renderTemplate.bind(view)();
  })
  .then(() => {
    const state = {
      process: 'waiting',
      feeds: [],
      items: {},
      loadedFeeds: [],
      errors: [],
      uiState: {
        readItems: [],
        modalWindow: {
          title: null,
          body: null,
          link: null,
        },
      },
    };

    const watchedState = onChange(state, (changedStateSection) => {
    if (changedStateSection === 'process') {
      console.log('new process:', watchedState.process)
      view.render(watchedState);
    }
  });

  const form = document.getElementById('rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    console.log('start submit handling')

    watchedState.process = 'processingRequest';

    const rssChannelUrl = document.getElementById('rss-input').value;

    const rssUrlValidationSchema = yup
      .string()
      .notOneOf(watchedState.loadedFeeds, 'duplicationUrlError')
      .matches(
        /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([w#!:.?+=&%@!]))?/,
        'invalidRssUrlError',
      );

    try {
      rssUrlValidationSchema.validateSync(rssChannelUrl);
    } catch (validationError) {
      const errorMessage = validationError.errors[0];
      watchedState.errors.push({ error: validationError, type: errorMessage });
      watchedState.process = 'processingError';
      return;
    }

    axios
      .get(proxify(rssChannelUrl))
      .then((response) => response.data)
      .catch((networkError) => {
        watchedState.errors.push({ error: networkError, type: 'networkError' });
        watchedState.process = 'processingError';
      })
      .then((data) => {
        const parsedRssChannel = parseRSS(data.contents);
        watchedState.loadedFeeds.push(rssChannelUrl);

        const feedId = watchedState.loadedFeeds.length;
        const title = parsedRssChannel.querySelector('channel title')
          .textContent;
        const description = parsedRssChannel.querySelector(
          'channel description',
        ).textContent;
        const link = parsedRssChannel.querySelector('channel link').textContent;
        watchedState.feeds = [
          {
            feedId,
            title,
            description,
            link,
          },
          ...watchedState.feeds,
        ];

        const currentFeedItems = Array.from(
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

        watchedState.items[feedId] = currentFeedItems;

        watchedState.process = 'processingFeeds';

        setTimeout(() => {
          update(rssChannelUrl, 5000, watchedState, feedId);
        }, 5000);
      })
      .catch((parsingError) => {
        watchedState.errors.push({ error: parsingError, type: 'parsingError' });
        watchedState.process = 'processingError';
      });
  });
  });


  /*const state = {
    process: 'waiting',
    feeds: [],
    items: {},
    loadedFeeds: [],
    errors: [],
    uiState: {
      readItems: [],
      modalWindow: {
        title: null,
        body: null,
        link: null,
      },
    },
  };

  const watchedState = onChange(state, (changedStateSection) => {
    if (changedStateSection === 'process') {
      console.log('new process:', watchedState.process)
      view.render(watchedState);
    }
  });

  

  const form = document.getElementById('rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    console.log('start submit handling')

    watchedState.process = 'processingRequest';

    const rssChannelUrl = document.getElementById('rss-input').value;

    const rssUrlValidationSchema = yup
      .string()
      .notOneOf(watchedState.loadedFeeds, 'duplicationUrlError')
      .matches(
        /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([w#!:.?+=&%@!]))?/,
        'invalidRssUrlError',
      );

    try {
      rssUrlValidationSchema.validateSync(rssChannelUrl);
    } catch (validationError) {
      const errorMessage = validationError.errors[0];
      watchedState.errors.push({ error: validationError, type: errorMessage });
      watchedState.process = 'processingError';
      return;
    }

    axios
      .get(proxify(rssChannelUrl))
      .then((response) => response.data)
      .catch((networkError) => {
        watchedState.errors.push({ error: networkError, type: 'networkError' });
        watchedState.process = 'processingError';
      })
      .then((data) => {
        const parsedRssChannel = parseRSS(data.contents);
        watchedState.loadedFeeds.push(rssChannelUrl);

        const feedId = watchedState.loadedFeeds.length;
        const title = parsedRssChannel.querySelector('channel title')
          .textContent;
        const description = parsedRssChannel.querySelector(
          'channel description',
        ).textContent;
        const link = parsedRssChannel.querySelector('channel link').textContent;
        watchedState.feeds = [
          {
            feedId,
            title,
            description,
            link,
          },
          ...watchedState.feeds,
        ];

        const currentFeedItems = Array.from(
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

        watchedState.items[feedId] = currentFeedItems;

        watchedState.process = 'processingFeeds';

        setTimeout(() => {
          update(rssChannelUrl, 5000, watchedState, feedId);
        }, 5000);
      })
      .catch((parsingError) => {
        watchedState.errors.push({ error: parsingError, type: 'parsingError' });
        watchedState.process = 'processingError';
      });
  });*/
};
