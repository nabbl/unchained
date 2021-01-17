Package.describe({
  name: 'unchained:core-files',
  version: '0.55.4',
  summary: 'Unchained Engine Core: Files',
  git: 'https://github.com/unchainedshop/unchained',
  documentation: 'README.md',
});

Npm.depends({
  'fs-extra': '9.0.1',
  'isomorphic-unfetch': '3.1.0',
  'file-type': '16.0.0',
  mongodb: '3.6.3',
  '@reactioncommerce/random': '1.0.2',
});

Package.onUse((api) => {
  api.versionsFrom('1.11.1');
  api.use('webapp', 'server');
  api.use(['mongo', 'ecmascript'], ['client', 'server']);

  api.use('unchained:core-settings@0.55.4');
  api.mainModule('core-files.js');
  api.export('FilesCollection');
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('unchained:core-files');
  api.mainModule('core-files-tests.js');
});
