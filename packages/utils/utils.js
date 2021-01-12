import Address from './address-schema';
import Contact from './contact-schema';
import * as schemaFields from './common-schema-fields';

export { default as findLocalizedText } from './find-localized-text';
export * from './locale-helpers';
export { default as objectInvert } from './object-invert';
export { default as findPreservingIds } from './find-preserving-ids';
export { default as findUnusedSlug } from './find-unused-slug';
export { default as slugify } from './slugify';

const Schemas = {
  ...schemaFields,
  Address,
  Contact,
};

export { Schemas };
