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
  const i18nextInstance = i18next.createInstance();
  return i18nextInstance.init(
  {
    lng: 'ru',
    resources,
  }).then((t) => {
      const view = new View();
      view.init(t);
      view.renderTemplate.bind(view)();

      const button = document.querySelector('button[name=add]');

      button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('button click')
        document.getElementById('feedback').textContent = 'RSS успешно загружен';
      });
    });
    
};
