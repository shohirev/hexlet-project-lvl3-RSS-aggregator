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

      const form = document.getElementById('rss-form');
      const input = document.getElementById('rss-input');
      const button = document.querySelector('.btn[name=add]');
      console.log(123)
      console.log('form:', form.outerHTML);
      console.log('input:', input);
      console.log('button:', button);

      form.addEventListener('submit', (e) => {
        e.preventDefault()
        console.log('form submitted!')
        document.getElementById('feedback').textContent = 'RSS успешно загружен';
      });

      input.addEventListener('change', (e) => {
        console.log('input changed!');
      });

      button.addEventListener('click', (e) => {
        console.log('button clicked!');
      });
    });
    
};
