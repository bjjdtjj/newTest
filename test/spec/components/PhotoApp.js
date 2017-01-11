'use strict';

describe('PhotoApp', () => {
  let React = require('react/addons');
  let PhotoApp, component;

  beforeEach(() => {
    let container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    PhotoApp = require('components/PhotoApp.js');
    component = React.createElement(PhotoApp);
  });

  it('should create a new instance of PhotoApp', () => {
    expect(component).toBeDefined();
  });
});
