import _ from 'lodash';

/*const mainTitle = document.querySelector('title');
const addChannelsBtn = document.querySelector('.btn[name=add]');
const inputField = document.getElementById('rss-input');
const feedbackContainer = document.getElementById('feedback');
const feedsListTitle = document.querySelector('div#feeds h2');
const postsListTitle = document.querySelector('div#posts h2');
const feedsList = document.getElementById('feeds-list');
const postsList = document.getElementById('posts-list');
const modalTitle = document.querySelector('.modal-title');
const modalBody = document.querySelector('.modal-body');
const modalFollowLinkBtn = document.getElementById('modalFollowLinkBtn');
const modalCloseBtn = document.getElementById('modalCloseBtn');

const renderTemplate = (i18nextTranslate) => {
  const mainTitle = document.querySelector('title');
  const inputField = document.getElementById('rss-input');
  const addChannelsBtn = document.querySelector('.btn[name=add]');
  const modalFollowLinkBtn = document.getElementById('modalFollowLinkBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  mainTitle.textContent = i18nextTranslate('templateText.title');
  inputField.placeholder = i18nextTranslate('templateText.placeholder');
  addChannelsBtn.textContent = i18nextTranslate('templateText.addChannelsBtn');
  modalFollowLinkBtn.textContent = i18nextTranslate('templateText.modal.followLinkBtn');
  modalCloseBtn.textContent = i18nextTranslate('templateText.modal.closeBtn');
};

const toggleForm = (model) => {
  if (model.process === 'processingRequest') {
    inputField.setAttribute('readonly', true);
    addChannelsBtn.setAttribute('disabled', true);
  } else {
    inputField.removeAttribute('readonly');
    addChannelsBtn.removeAttribute('disabled');
  }
};

const renderFeedback = (model, i18nextTranslate) => {
  if (model.error) {
    inputField.classList.add('border', 'border-danger');
    feedbackContainer.classList.remove('text-success');
    feedbackContainer.classList.add('text-danger');
    feedbackContainer.textContent = i18nextTranslate(`feedback.${model.error}`);
  } else {
    inputField.classList.remove('border', 'border-danger');
    feedbackContainer.classList.remove('text-danger');
    feedbackContainer.classList.add('text-success');
    feedbackContainer.textContent = i18nextTranslate('feedback.successfulLoading');
  }
};

const renderModalWindow = (model) => {
  modalTitle.textContent = model.uiState.modalWindow.title;
  modalBody.textContent = model.uiState.modalWindow.body;
  modalFollowLinkBtn.setAttribute('href', model.uiState.modalWindow.link);
};

const render = (model, i18nextTranslate) => {
  toggleForm(model);
  renderFeedback(model, i18nextTranslate);
  renderModalWindow(model);

  inputField.value = model.uiState.input;

  feedsListTitle.textContent = i18nextTranslate('templateText.feedsListTitle');
  postsListTitle.textContent = i18nextTranslate('templateText.postsListTitle');

  feedsList.innerHTML = '';
  postsList.innerHTML = '';

  _.forEach(model.feeds, (feed) => {
    const feedsListItem = document.createElement('li');
    feedsListItem.classList.add('list-group-item');
    feedsListItem.innerHTML = `<h3>${feed.title}</h3><p>${feed.description}</p>`;
    feedsList.append(feedsListItem);
  });

  _.forEach(model.feeds, (feed) => {
    const { id } = feed;
    const feedItems = model.items[id];

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
      const postLinkStyle = model.viewedPosts.includes(item.title)
        ? 'font-weight-normal'
        : 'font-weight-bold';
      postLink.classList.add(postLinkStyle);
      postWrapper.append(postLink);

      const postButton = document.createElement('button');
      postButton.classList.add('previewBtn', 'btn', 'btn-primary', 'btn-sm');
      postButton.dataset.toggle = 'modal';
      postButton.dataset.target = '#modal';
      postButton.textContent = i18nextTranslate('templateText.previewBtn');
      postButton.addEventListener('click', () => {
        model.process = 'modal handling';
        model.uiState.modalWindow = {
          title: item.title,
          body: item.description,
          link: item.link,
        };
        model.viewedPosts = [...model.viewedPosts, item.title];
        model.process = 'waiting';
      });
      postWrapper.append(postButton);
    });
  });
};*/

export default (model, i18nextTranslate) => {
  /*const renders = {
    initializing: () => { renderTemplate(i18nextTranslate) },
    processingRequest: () => { toggleForm(model) },
    waiting: () => { render(model, i18nextTranslate) },
  };

  if (_.has(renders, model.process)) {
    renders[model.process]();
  }*/

  const mainTitle = document.querySelector('title');
  const addChannelsBtn = document.querySelector('.btn[name=add]');
  const inputField = document.getElementById('rss-input');
  const feedbackContainer = document.getElementById('feedback');
  const feedsListTitle = document.querySelector('div#feeds h2');
  const postsListTitle = document.querySelector('div#posts h2');
  const feedsList = document.getElementById('feeds-list');
  const postsList = document.getElementById('posts-list');
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const modalFollowLinkBtn = document.getElementById('modalFollowLinkBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  switch (model.process) {
    case 'initializing':
      mainTitle.textContent = i18nextTranslate('templateText.title');
      inputField.placeholder = i18nextTranslate('templateText.placeholder');
      addChannelsBtn.textContent = i18nextTranslate('templateText.addChannelsBtn');
      modalFollowLinkBtn.textContent = i18nextTranslate('templateText.modal.followLinkBtn');
      modalCloseBtn.textContent = i18nextTranslate('templateText.modal.closeBtn');
      break;
    case 'processingRequest':
      inputField.setAttribute('readonly', true);
      addChannelsBtn.setAttribute('disabled', true);
      break;
    case 'waiting':
      inputField.removeAttribute('readonly');
      addChannelsBtn.removeAttribute('disabled');

      if (model.error) {
        inputField.classList.add('border', 'border-danger');
        feedbackContainer.classList.remove('text-success');
        feedbackContainer.classList.add('text-danger');
        feedbackContainer.textContent = i18nextTranslate(`feedback.${model.error}`);
      } else {
        inputField.classList.remove('border', 'border-danger');
        feedbackContainer.classList.remove('text-danger');
        feedbackContainer.classList.add('text-success');
        feedbackContainer.textContent = i18nextTranslate('feedback.successfulLoading');
      }

      modalTitle.textContent = model.uiState.modalWindow.title;
      modalBody.textContent = model.uiState.modalWindow.body;
      modalFollowLinkBtn.setAttribute('href', model.uiState.modalWindow.link);   

      inputField.value = model.uiState.input;

      feedsListTitle.textContent = i18nextTranslate('templateText.feedsListTitle');
      postsListTitle.textContent = i18nextTranslate('templateText.postsListTitle');

      feedsList.innerHTML = '';
      postsList.innerHTML = '';

      _.forEach(model.feeds, (feed) => {
        const feedsListItem = document.createElement('li');
        feedsListItem.classList.add('list-group-item');
        feedsListItem.innerHTML = `<h3>${feed.title}</h3><p>${feed.description}</p>`;
        feedsList.append(feedsListItem);
      });

      _.forEach(model.feeds, (feed) => {
        const { id } = feed;
        const feedItems = model.items[id];

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
          const postLinkStyle = model.viewedPosts.includes(item.title)
            ? 'font-weight-normal'
            : 'font-weight-bold';
          postLink.classList.add(postLinkStyle);
          postWrapper.append(postLink);

          const postButton = document.createElement('button');
          postButton.classList.add('previewBtn', 'btn', 'btn-primary', 'btn-sm');
          postButton.dataset.toggle = 'modal';
          postButton.dataset.target = '#modal';
          postButton.textContent = i18nextTranslate('templateText.previewBtn');
          postButton.addEventListener('click', () => {
            model.process = 'modal handling';
            model.uiState.modalWindow = {
              title: item.title,
              body: item.description,
              link: item.link,
            };
            model.viewedPosts = [...model.viewedPosts, item.title];
            model.process = 'waiting';
          });
          postWrapper.append(postButton);
        });
      });

    default:
      return;
  }
};
