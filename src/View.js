import _ from 'lodash';

export default class View {
  init(i18nextInstance) {
    console.log('render init start')
    this.i18nextInstance = i18nextInstance;
    this.mainTitle = document.querySelector('title');
    this.addChannelsBtn = document.querySelector('.btn[name=addChannelsBtn]');
    this.formFieldset = document.querySelector('fieldset');
    this.inputField = document.getElementById('rss-input');
    this.feedbackContainer = document.getElementById('feedback');
    this.feedsListTitle = document.querySelector('div#feeds h2');
    this.postsListTitle = document.querySelector('div#posts h2');
    this.feedsList = document.getElementById('feeds-list');
    this.postsList = document.getElementById('posts-list');
    this.modalTitle = document.querySelector('.modal-title');
    this.modalBody = document.querySelector('.modal-body');
    this.modalLinkBtn = document.getElementById('modalLinkBtn');
    this.modalCloseBtn = document.getElementById('modalCloseBtn');
  }

  render(model) {
    console.log('render start')
    const mapping = {
      processingRequest: 'renderRequest',
      processingError: 'renderError',
      processingFeeds: 'renderFeeds',
      processingUpdates: 'renderPosts',
      presentingPreview: 'presentPreview',
    };

    if (_.has(mapping, model.process)) {
      const selectedRender = mapping[model.process];
      this[selectedRender](model);
    }
  }

  decorateFeedback(process) {
    switch (process) {
      case 'processingError':
        this.inputField.classList.add('border', 'border-danger');
        this.feedbackContainer.classList.remove('text-success');
        this.feedbackContainer.classList.add('text-danger');
        break;
      default:
        this.inputField.classList.remove('border', 'border-danger');
        this.feedbackContainer.classList.remove('text-danger');
        this.feedbackContainer.classList.add('text-success');
    }
  }

  renderTemplate() {
    this.mainTitle.textContent = this.i18nextInstance('templateText.title');

    this.inputField.placeholder = this.i18nextInstance('templateText.placeholder');

    this.addChannelsBtn.textContent = this.i18nextInstance('templateText.addChannelsBtn');

    this.modalLinkBtn.textContent = this.i18nextInstance('templateText.modal.linkBtn');
    this.modalCloseBtn.textContent = this.i18nextInstance('templateText.modal.closeBtn');
  }

  renderRequest() {
    this.formFieldset.setAttribute('disable', 'disable');
  }

  renderError(model) {
    this.decorateFeedback(model.process);

    const currentError = _.last(model.errors);
    this.feedbackContainer.textContent = this.i18nextInstance(
      `errorFeedback.${currentError.type}`,
    );

    this.formFieldset.removeAttribute('disable');
  }

  renderPosts(model) {
    this.postsList.innerHTML = '';
    this.postsListTitle.textContent = this.i18nextInstance('templateText.postsListTitle');

    _.forEach(model.feeds, (feed) => {
      const { feedId } = feed;
      const feedItems = model.items[feedId];

      feedItems.forEach((item) => {
        const post = document.createElement('li');
        post.classList.add('list-group-item');
        this.postsList.append(post);

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
        postButton.textContent = this.i18nextInstance('templateText.previewBtn');

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
  }

  renderFeeds(model) {
    this.feedbackContainer.textContent = this.i18nextInstance('successfulLoadingReport');
    this.feedsList.innerHTML = '';

    this.decorateFeedback(model.process);

    this.feedsListTitle.textContent = this.i18nextInstance('templateText.feedsListTitle');

    _.forEach(model.feeds, (feed) => {
      const newFeedsListItem = document.createElement('li');
      newFeedsListItem.classList.add('list-group-item');
      newFeedsListItem.innerHTML = `<h3>${feed.title}</h3><p>${feed.description}</p>`;
      this.feedsList.append(newFeedsListItem);
    });

    this.renderPosts(model);

    this.inputField.value = '';
    this.formFieldset.removeAttribute('disable');
  }

  presentPreview(model) {
    this.modalTitle.textContent = model.uiState.modalWindow.title;
    this.modalBody.textContent = model.uiState.modalWindow.body;

    this.modalLinkBtn.setAttribute('href', model.uiState.modalWindow.link);

    this.renderPosts(model);
  }
}
