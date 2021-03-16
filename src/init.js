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
  return new Promise((resolve, reject) => {
    const i18nextInstance = i18next.createInstance();
    i18nextInstance.init(
    {
      lng: 'ru',
      resources,
    },
    (err, t) => {
      console.log('start cb in i18next')
      const view = new View();
      view.init(t);
      view.renderTemplate.bind(view)();
    });
    console.log('start handling button')
    const button = document.querySelector('button[name=add]');

    button.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('button click')
      document.getElementById('feedback').textContent = 'RSS успешно загружен';
    });

    console.log('button handled')
    resolve(this);
  });
};
