import * as yup from 'yup';

export default (url, model) => {
  const loadedUrls = model.feeds.map((feed) => feed.url);

  const validationSchema = yup
        .string()
        .url('invalidRssUrlError')
        .notOneOf(loadedUrls, 'duplicationUrlError');

  try {
    validationSchema.validateSync(url);
  } catch (validationError) {
    const error = validationError.errors[0];
    model.error = error;
    model.uiState.input = url;
    model.process = 'waiting';
    return;
  }
};
