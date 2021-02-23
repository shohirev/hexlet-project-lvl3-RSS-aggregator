import i18next from 'i18next';
import _ from 'lodash';

const formFieldset = document.querySelector('fieldset');
const inputField = document.getElementById('rss-input');
const feedbackContainer = document.getElementById('feedback');
const feedsListTitle = document.querySelector('div#feeds h2');
const postsListTitle = document.querySelector('div#posts h2');
const feedsList = document.getElementById('feeds-list');
const postsList = document.getElementById('posts-list');
const modalLinkBtn = document.getElementById('modalLinkBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');

const decorate = (process) => {
  switch (process) {
    case 'processingError':
      inputField.classList.add('border', 'border-danger');
      feedbackContainer.classList.remove('text-success');
      feedbackContainer.classList.add('text-danger');
      break;
    default:
      inputField.classList.remove('border', 'border-danger');
      feedbackContainer.classList.remove('text-danger');
      feedbackContainer.classList.add('text-success');
  }
};

const renderTemplate = () => {
  const mainTitle = document.querySelector('title');
  mainTitle.textContent = i18next.t('templateText.title');

  inputField.placeholder = i18next.t('templateText.placeholder');

  const addChannelsBtn = document.querySelector('.btn[name=addChannelsBtn]');
  addChannelsBtn.textContent = i18next.t('templateText.addChannelsBtn');

  modalLinkBtn.textContent = i18next.t('templateText.modal.linkBtn');
  modalCloseBtn.textContent = i18next.t('templateText.modal.closeBtn');
};

const renderRequest = () => {
  formFieldset.setAttribute('disable', 'disable');
};

const renderError = (model) => {
  decorate(model.process);

  const currentError = _.last(model.errors);
  feedbackContainer.textContent = i18next.t(
    `errorFeedback.${currentError.type}`,
  );
  formFieldset.removeAttribute('disable');
};

const renderPosts = (model) => {
  postsList.innerHTML = '';
  postsListTitle.textContent = i18next.t('templateText.postsListTitle');

  _.forEach(model.feeds, (feed) => {
    const { feedId } = feed;
    const feedItems = model.items[feedId];

    feedItems.forEach((item) => {
      const post = document.createElement('li');
      post.classList.add('list-group-item');
      postsList.append(post);

      const postWrapper = document.createElement('div');
      postWrapper.classList.add(
        'd-flex',
        'justify-content-between',
        'align-items-center',
      );
      post.append(postWrapper);

      const postLink = document.createElement('a');
      postLink.href = `${item.link}`;
      postLink.textContent = `${item.title}`;
      const postLinkStyle = model.uiState.readItems.includes(item.title)
        ? 'font-weight-normal'
        : 'font-weight-bold';
      postLink.classList.add(postLinkStyle);

      const postButton = document.createElement('button');
      postButton.classList.add('previewBtn', 'btn', 'btn-primary', 'btn-sm');
      postButton.dataset.toggle = 'modal';
      postButton.dataset.target = '#modal';
      postButton.textContent = i18next.t('templateText.previewBtn');

      postButton.addEventListener('click', () => {
        model.uiState.readItems.push(item.title);
        model.uiState.modalWindow = {
          title: item.title,
          body: item.description,
          link: item.link,
        };
        model.process = 'presentingPreview';
      });

      postWrapper.append(postLink);
      postWrapper.append(postButton);
    });
  });
};

const renderFeeds = (model) => {
  feedsList.innerHTML = '';

  decorate(model.process);

  feedsListTitle.textContent = i18next.t('templateText.feedsListTitle');
  feedbackContainer.textContent = i18next.t('successfulLoadingReport');

  _.forEach(model.feeds, (feed) => {
    const newFeedsListItem = document.createElement('li');
    newFeedsListItem.classList.add('list-group-item');
    newFeedsListItem.innerHTML = `<h3>${feed.title}</h3><p>${feed.description}</p>`;
    feedsList.append(newFeedsListItem);
  });

  renderPosts(model);

  inputField.value = '';
  formFieldset.removeAttribute('disable');
};

const presentPreview = (model) => {
  const modalTitle = document.querySelector('.modal-title');
  modalTitle.textContent = model.uiState.modalWindow.title;

  const modalBody = document.querySelector('.modal-body');
  modalBody.textContent = model.uiState.modalWindow.body;

  modalLinkBtn.setAttribute('href', model.uiState.modalWindow.link);

  renderPosts(model);
};

const render = (model) => {
  const renders = {
    processingRequest: renderRequest,
    processingError: renderError,
    processingFeeds: renderFeeds,
    processingUpdates: renderPosts,
    presentingPreview: presentPreview,
  };

  if (_.has(renders, model.process)) {
    renders[model.process](model);
  }
};

export { renderTemplate, render };
