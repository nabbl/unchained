Package.describe({
  name: 'unchained:core-countries',
  version: '0.61.0',
  summary: 'Unchained Engine Core: Countries',
  git: 'https://github.com/unchainedshop/unchained',
  documentation: 'README.md',
});

Npm.depends({
  'lru-cache': '6.0.0',
  'emoji-flags': '1.3.0',
  'i18n-iso-countries': '6.4.0',
});

Package.onUse((api) => {
  api.versionsFrom('1.11.1');
  api.use('ecmascript');
  api.use('mongo');
  api.use('dburles:collection-helpers@1.1.0');
  api.use('aldeed:collection2@3.2.1');
  api.use('unchained:utils@0.61.0');
  api.use('unchained:core-currencies@0.61.0');

  api.mainModule('countries.js', 'server');
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('unchained:core-countries');
  api.mainModule('countries-tests.js');
});
