Package.describe({
  name: 'unchained:core-warehousing',
  version: '0.61.0',
  summary: 'Unchained Engine Core: Warehousing',
  git: 'https://github.com/unchainedshop/unchained',
  documentation: 'README.md',
});

Npm.depends({
  'lru-cache': '6.0.0',
  'node-sheets': '1.1.0',
});

Package.onUse((api) => {
  api.versionsFrom('1.11.1');
  api.use('ecmascript');
  api.use('mongo');
  api.use('promise');
  api.use('dburles:collection-helpers@1.1.0');
  api.use('aldeed:collection2@3.2.1');
  api.use('percolate:migrations@1.0.2');

  api.use('unchained:utils@0.61.0');
  api.use('unchained:core-logger@0.61.0');

  api.mainModule('warehousing.js', 'server');
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('unchained:core-warehousing');
  api.mainModule('warehousing-tests.js');
});
