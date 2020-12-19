import i18next from 'i18next';

const renderPage = () => {
  const mainTitle = document.querySelector('title');
  mainTitle.textContent = i18next.t('title');

  const inputField = document.getElementById('rss-input');
  inputField.placeholder = i18next.t('placeholder');

  const button = document.querySelector('button');
  button.textContent = i18next.t('addButton');

  const feedsListTitle = document.querySelector('div#feeds h2');
  feedsListTitle.textContent = i18next.t('feedsListTitle');

  const postsListTitle = document.querySelector('div#posts h2');
  postsListTitle.textContent = i18next.t('postsListTitle');
};

const renderValidationError = (model) => {
  const feedbackContainer = document.getElementById('feedback');
  const feedInput = document.getElementById('rss-input');
  
  feedInput.classList.add('border', 'border-danger');
  feedbackContainer.classList.add('text-danger');
  feedbackContainer.textContent = i18next.t(model.validation.error);
};

const renderNetworkError = () => {
  const feedbackContainer = document.getElementById('feedback');
  feedbackContainer.classList.add('text-danger');
  feedbackContainer.textContent = i18next.t('networkError');
};

const renderParsingError = () => {
  const feedbackContainer = document.getElementById('feedback');
  feedbackContainer.classList.add('text-danger');
  feedbackContainer.textContent = i18next.t('parsingError');
};

const renderNewFeed = (model) => {
  const feedInput = document.getElementById('rss-input');
  const feedbackContainer = document.getElementById('feedback');
  feedInput.classList.remove('border', 'border-danger');
  feedbackContainer.classList.remove('text-danger');
  feedbackContainer.classList.add('text-success');
  feedbackContainer.textContent = i18next.t('successfulLoadingReport');

  const newFeed = _.last(model.feeds);

  const feedsList = document.getElementById('feeds-list');
  const newFeedsListItem = document.createElement('li');
  newFeedsListItem.classList.add('list-group-item');
  newFeedsListItem.innerHTML = `<h3>${newFeed.title}</h3><p>${newFeed.description}</p>`;
  feedsList.append(newFeedsListItem);

  const postsContainer = document.getElementById('posts-container');
  const newFeedPostsList = document.createElement('ul');
  newFeedPostsList.classList.add('list-group');
  newFeedPostsList.id = `${newFeed.title}-posts`;

  newFeed.items
    .map((newFeedItem) => {
      const postsListItem = document.createElement('li');
      postsListItem.classList.add('list-group-item');

      const postWrapper = document.createElement('div');
      postWrapper.classList.add('d-flex', 'justify-content-between', 'align-items-center');

      const postTextHtml = document.createElement('a');
      postTextHtml.href = `${newFeedItem.link}`;
      postTextHtml.textContent = `${newFeedItem.title}`;
      postTextHtml.classList.add('font-weight-bold');

      const postBtn = document.createElement('button');
      postBtn.classList.add('previewBtn', 'btn', 'btn-primary', 'btn-sm');
      postBtn.dataset.toggle = 'modal';
      postBtn.dataset.target = '#modal';
      postBtn.textContent = i18next.t('previewButton');

      postWrapper.append(postTextHtml);
      postWrapper.append(postBtn);

      postsListItem.append(postWrapper);

      postBtn.addEventListener('click', (e) => {
        e.target.previousElementSibling.classList.remove('font-weight-bold');
        e.target.previousElementSibling.classList.add('font-weight-normal');

        const modalHeader = document.querySelector('.modal-header');
        const modalBody = document.querySelector('.modal-body');
        modalHeader.innerHTML = newFeedItem.title;
        modalBody.innerHTML = newFeedItem.description;
      });
      return postsListItem;
    })
    .forEach((handledPost) => newFeedPostsList.append(handledPost));

  postsContainer.append(newFeedPostsList);
};

const renderWaiting = () => {
  const feedInput = document.getElementById('rss-input');
  feedInput.value = '';

  document.querySelector('button[name=addChannelBtn]').classList.toggle('disabled');
};

const renderUpdates = (model) => {
  const updatingFeed = _.find(model.feeds, (feed) => feed.title === model.updates.feedTitle);
  const updatingPostsList = document.getElementById(`${updatingFeed.title}-posts`);
  updatingPostsList.innerHTML = '';

  updatingFeed.items
    .map((item) => {
       const postsListItem = document.createElement('li');
      postsListItem.classList.add('list-group-item');

      const postWrapper = document.createElement('div');
      postWrapper.classList.add('d-flex', 'justify-content-between', 'align-items-center');

      const postTextHtml = document.createElement('a');
      postTextHtml.href = `${item.link}`;
      postTextHtml.textContent = `${item.title}`;
      postTextHtml.classList.add('font-weight-bold');

      const postBtn = document.createElement('button');
      postBtn.classList.add('previewBtn', 'btn', 'btn-primary', 'btn-sm');
      postBtn.dataset.toggle = 'modal';
      postBtn.dataset.target = '#modal';
      postBtn.textContent = i18next.t('previewButton');

      postWrapper.append(postTextHtml);
      postWrapper.append(postBtn);

      postsListItem.append(postWrapper);

      postBtn.addEventListener('click', (e) => {
        e.target.previousElementSibling.classList.remove('font-weight-bold');
        e.target.previousElementSibling.classList.add('font-weight-normal');

        const modalHeader = document.querySelector('.modal-header');
        const modalBody = document.querySelector('.modal-body');
        modalHeader.innerHTML = item.title;
        modalBody.innerHTML = item.description;
      });
      return postsListItem;
    })
    .forEach((handledPost) => updatingPostsList.append(handledPost));
};

const renders = {
  page: renderPage,
  validationError: renderValidationError,
  networkError: renderNetworkError,
  parsingError: renderParsingError,
  newFeed: renderNewFeed,
  updates: renderUpdates,
  waiting: renderWaiting,
};

export default renders;