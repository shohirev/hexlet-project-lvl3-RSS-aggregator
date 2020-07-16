import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';

function component() {
  const element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack', '123'], ' ');

  return element;
}

document.body.appendChild(component());