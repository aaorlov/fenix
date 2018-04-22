
### npm scripts

**npm start** - run webpack dev server.

**npm run build** - build development build

**npm run build:prod** - build production build

**npm run storybook** - generate storybook

**npm run clean** - clean dist directory

**npm run test** - run all unit tests

**npm run test:watch** - run test at watch mode

**npm run test:cover** - generate test coverage


### Project data structure example
```
/src
  /assets
  /store
  /components
    /button
      index.js
      button.jsx
      button.css
      button.spec.js
    /navigation
      navigation.jsx
      navigation.css
      navigation.spec.js
      index.js
  /features
    /data-asset
      /containers
        /list
          list-container.jsx
          list-container.spec.js
          index.js
        /view
          view-container.jsx
          view-container.spec.js
          index.js
      /components
        /remove-button
          remove-button.jsx
          remove-button.spec.js
          index.js
        /list
          list.jsx
          list.spec.js
          index.js
        /sidebar
          sidebar.jsx
          list.spec.js
          index.js
```
