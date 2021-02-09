import runMigrations from './db/migrations';

export * from './db/product-media';
export * from './db/product-variations';
export * from './db/product-reviews';
export * from './db/products';

export default () => {
  // configure
  runMigrations();
};
