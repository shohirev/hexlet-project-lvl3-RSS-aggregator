import * as yup from 'yup';

export default (url, loadedUrls) => {
  const validationSchema = yup
    .string()
    .url('invalidRssUrlError')
    .notOneOf(loadedUrls, 'duplicationUrlError');

  validationSchema.validateSync(url);
};
