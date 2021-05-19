/* eslint-disable no-param-reassign */

console.log(document.head.outerHTML)
console.log(document.body.outerHTML)
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

export default (model, i18nextTranslate) => {
  console.log('render start!!')

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
    default:
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

      if (model.uiState.modalWindowPostTitle) {
        const { modalWindowPostTitle } = model.uiState;
        const modalWindowPost = model.posts.find((post) => post.title === modalWindowPostTitle);

        modalTitle.textContent = modalWindowPost.title;
        modalBody.textContent = modalWindowPost.description;
        modalFollowLinkBtn.setAttribute('href', modalWindowPost.link);
      }

      if (!model.error) {
        inputField.value = '';
      }

      feedsListTitle.textContent = i18nextTranslate('templateText.feedsListTitle');
      postsListTitle.textContent = i18nextTranslate('templateText.postsListTitle');

      feedsList.innerHTML = '';
      postsList.innerHTML = '';

      model.feeds.forEach((feed) => {
        const feedsListItem = document.createElement('li');
        feedsListItem.classList.add('list-group-item');
        feedsListItem.innerHTML = `<h3>${feed.title}</h3><p>${feed.description}</p>`;
        feedsList.append(feedsListItem);
      });

      model.posts.forEach((post) => {
        const postsListItem = document.createElement('li');
        postsListItem.classList.add('list-group-item');
        postsList.append(postsListItem);

        const postWrapper = document.createElement('div');
        postWrapper.classList.add(
          'd-flex',
          'justify-content-between',
          'align-items-center',
        );
        postsListItem.append(postWrapper);

        const postLink = document.createElement('a');
        postLink.href = post.link;
        postLink.textContent = post.title;
        const postLinkStyle = post.isViewed
          ? 'font-weight-normal'
          : 'font-weight-bold';
        postLink.classList.add(postLinkStyle);
        postWrapper.append(postLink);

        const previewBtn = document.createElement('button');
        previewBtn.classList.add('previewBtn', 'btn', 'btn-primary', 'btn-sm');
        previewBtn.dataset.toggle = 'modal';
        previewBtn.dataset.target = '#modal';
        previewBtn.textContent = i18nextTranslate('templateText.previewBtn');
        previewBtn.addEventListener('click', () => {
          model.process = 'changingModalPost';

          model.uiState.modalWindowPostTitle = post.title;
          post.isViewed = true;

          model.process = 'waiting';
        });

        postWrapper.append(previewBtn);
      });
  }
};
