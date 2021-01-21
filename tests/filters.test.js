import {
  setupDatabase,
  createLoggedInGraphqlFetch,
  createAnonymousGraphqlFetch,
} from './helpers';
import { ADMIN_TOKEN } from './seeds/users';
import { MultiChoiceFilter } from './seeds/filters';

let connection;
let graphqlFetch;

describe('Filters', () => {
  beforeAll(async () => {
    [, connection] = await setupDatabase();
    graphqlFetch = await createLoggedInGraphqlFetch(ADMIN_TOKEN);
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('Query.filters for admin user should', () => {
    it('return list of active filters', async () => {
      const {
        data: { filters },
      } = await graphqlFetch({
        query: /* GraphQL */ `
          query Filters(
            $limit: Int = 10
            $offset: Int = 0
            $includeInactive: Boolean = false
          ) {
            filters(
              limit: $limit
              offset: $offset
              includeInactive: $includeInactive
            ) {
              _id
              updated
              created
              isActive
              texts {
                _id
                locale
                title
                subtitle
              }
              type
              key
              key
              options {
                _id
                texts {
                  _id
                  locale
                  title
                  subtitle
                }
                value
              }
            }
          }
        `,
        variables: {},
      });
      expect(filters.length).toEqual(0);
    });

    it('return list of active and in-active filters', async () => {
      const {
        data: { filters },
      } = await graphqlFetch({
        query: /* GraphQL */ `
          query Filters(
            $limit: Int = 10
            $offset: Int = 0
            $includeInactive: Boolean = false
          ) {
            filters(
              limit: $limit
              offset: $offset
              includeInactive: $includeInactive
            ) {
              _id
            }
          }
        `,
        variables: {
          includeInactive: true,
        },
      });
      expect(filters.length).toEqual(1);
    });
  });

  describe('Query.filter for admin user should', () => {
    it('return single filter for existing filter id', async () => {
      const {
        data: { filter },
      } = await graphqlFetch({
        query: /* GraphQL */ `
          query Filter($filterId: ID!) {
            filter(filterId: $filterId) {
              _id
              updated
              created
              isActive
              texts {
                _id
                locale
                title
                subtitle
              }
              type
              key
              key
              options {
                _id
                texts {
                  _id
                  locale
                  title
                  subtitle
                }
                value
              }
            }
          }
        `,
        variables: {
          filterId: MultiChoiceFilter._id,
        },
      });
      expect(filter._id).toEqual(MultiChoiceFilter._id);
    });

    it('return error when passed invalid filterId', async () => {
      const {
        data: { filter },
        errors,
      } = await graphqlFetch({
        query: /* GraphQL */ `
          query Filter($filterId: ID!) {
            filter(filterId: $filterId) {
              _id
            }
          }
        `,
        variables: {
          filterId: '',
        },
      });
      expect(filter).toBe(null);
      expect(errors[0]?.extensions?.code).toEqual('InvalidIdError');
    });
  });

  describe('Query.Filters for anonymous user should', () => {
    it('return error', async () => {
      const graphqlAnonymousFetch = await createAnonymousGraphqlFetch();
      const {
        data: { filters },
      } = await graphqlAnonymousFetch({
        query: /* GraphQL */ `
          query Filters(
            $limit: Int = 10
            $offset: Int = 0
            $includeInactive: Boolean = false
          ) {
            filters(
              limit: $limit
              offset: $offset
              includeInactive: $includeInactive
            ) {
              _id
            }
          }
        `,
        variables: {},
      });
      expect(Array.isArray(filters)).toBe(true);
    });
  });

  describe('mutation.updateFilterTexts for admin user should', () => {
    it('update filter texts successfuly when passed valid filter ID', async () => {
      const {
        data: { updateFilterTexts },
      } = await graphqlFetch({
        query: /* GraphQL */ `
          mutation UpdateFilterTexts(
            $filterId: ID!
            $filterOptionValue: String
            $texts: [UpdateFilterTextInput!]!
          ) {
            updateFilterTexts(
              filterId: $filterId
              filterOptionValue: $filterOptionValue
              texts: $texts
            ) {
              _id
              locale
              title
              subtitle
            }
          }
        `,
        variables: {
          filterId: MultiChoiceFilter._id,
          filterOptionValue: 'Hello world',
          texts: [
            {
              locale: 'en',
              title: 'english-filter-text',
              subtitle: 'english-filter-text-subtitle',
            },
            {
              locale: 'am',
              title: 'amharic-filter-text',
              subtitle: 'amharic-filter-text-subtitle',
            },
          ],
        },
      });

      expect(updateFilterTexts.length).toEqual(2);
      expect(updateFilterTexts[0]).toMatchObject({
        locale: 'en',
        title: 'english-filter-text',
        subtitle: 'english-filter-text-subtitle',
      });
    });

    it('return not found error when passed non existing filter ID', async () => {
      const { errors } = await graphqlFetch({
        query: /* GraphQL */ `
          mutation UpdateFilterTexts(
            $filterId: ID!
            $filterOptionValue: String
            $texts: [UpdateFilterTextInput!]!
          ) {
            updateFilterTexts(
              filterId: $filterId
              filterOptionValue: $filterOptionValue
              texts: $texts
            ) {
              _id
            }
          }
        `,
        variables: {
          filterId: 'invalid-id',
          filterOptionValue: 'Hello world',
          texts: [
            {
              locale: 'en',
              title: 'english-filter-text',
              subtitle: 'english-filter-text-subtitle',
            },
          ],
        },
      });
      expect(errors[0]?.extensions?.code).toEqual('FilterNotFoundError');
    });

    it('return error when passed  invalid filter ID', async () => {
      const { errors } = await graphqlFetch({
        query: /* GraphQL */ `
          mutation UpdateFilterTexts(
            $filterId: ID!
            $filterOptionValue: String
            $texts: [UpdateFilterTextInput!]!
          ) {
            updateFilterTexts(
              filterId: $filterId
              filterOptionValue: $filterOptionValue
              texts: $texts
            ) {
              _id
            }
          }
        `,
        variables: {
          filterId: '',
          filterOptionValue: 'Hello world',
          texts: [
            {
              locale: 'en',
              title: 'english-filter-text',
              subtitle: 'english-filter-text-subtitle',
            },
          ],
        },
      });
      expect(errors[0]?.extensions?.code).toEqual('InvalidIdError');
    });
  });

  describe('mutation.updateFilterTexts for anonymous user should', () => {
    it('return error', async () => {
      const graphqlAnonymousFetch = createAnonymousGraphqlFetch();
      const { errors } = await graphqlAnonymousFetch({
        query: /* GraphQL */ `
          mutation UpdateFilterTexts(
            $filterId: ID!
            $filterOptionValue: String
            $texts: [UpdateFilterTextInput!]!
          ) {
            updateFilterTexts(
              filterId: $filterId
              filterOptionValue: $filterOptionValue
              texts: $texts
            ) {
              _id
            }
          }
        `,
        variables: {
          filterId: MultiChoiceFilter._id,
          filterOptionValue: 'Hello world',
          texts: [
            {
              locale: 'en',
              title: 'english-filter-text',
              subtitle: 'english-filter-text-subtitle',
            },
          ],
        },
      });

      expect(errors.length).toEqual(1);
    });
  });

  describe('Mutation.createFilter', () => {
    it('create a new single choice filter', async () => {
      const { data: { createFilter } = {} } = await graphqlFetch({
        query: /* GraphQL */ `
          mutation createFilter($filter: CreateFilterInput!) {
            createFilter(filter: $filter) {
              _id
              isActive
              texts {
                title
              }
              type
              key
              options {
                _id
                texts {
                  _id
                  title
                  subtitle
                }
                value
              }
            }
          }
        `,
        variables: {
          filter: {
            key: 'warehousing.baseUnit',
            title: 'Mengeneinheit Filter',
            type: 'SINGLE_CHOICE',
            options: ['ST'],
          },
        },
      });
      expect(createFilter).toMatchObject({
        isActive: false,
        texts: {
          title: 'Mengeneinheit Filter',
        },
        type: 'SINGLE_CHOICE',
        key: 'warehousing.baseUnit',
        options: [
          {
            texts: null,
            value: 'ST',
          },
        ],
      });

      const { data: { searchProducts } = {} } = await graphqlFetch({
        query: /* GraphQL */ `
          query searchProducts(
            $queryString: String
            $filterQuery: [FilterQueryInput!]
          ) {
            searchProducts(
              queryString: $queryString
              filterQuery: $filterQuery
              includeInactive: true
              ignoreChildAssortments: false
            ) {
              totalProducts
              filters {
                filteredProducts
                definition {
                  _id
                  key
                }
                options {
                  isSelected
                  filteredProducts
                  definition {
                    _id
                    value
                  }
                }
              }
            }
          }
        `,
        variables: {
          queryString: 'product',
          filterQuery: null,
        },
      });

      expect(searchProducts).toMatchObject({
        totalProducts: 1,
        filters: [
          {
            filteredProducts: 1,
            definition: {
              key: 'tags',
            },
          },
          {
            filteredProducts: 1,
            definition: {
              key: 'warehousing.baseUnit',
            },
          },
        ],
      });
    });
  });

  describe('mutation.updateFilter for admin User', () => {
    it('should update filter successfuly when passed valid filter ID', async () => {
      const { data: { updateFilter } = {} } = await graphqlFetch({
        query: /* GraphQL */ `
          mutation UpdateFilter($filter: UpdateFilterInput!, $filterId: ID!) {
            updateFilter(filter: $filter, filterId: $filterId) {
              _id
              updated
              created
              isActive
              texts {
                _id
                locale
                title
                subtitle
              }
              type
              key
              options {
                _id
                value
                texts {
                  _id
                }
              }
            }
          }
        `,
        variables: {
          filterId: MultiChoiceFilter._id,
          filter: {
            isActive: true,
            key: '999',
          },
        },
      });

      expect(updateFilter.key).toEqual('999');
    });

    it('return not found error when passed non existing filter ID', async () => {
      const { errors } = await graphqlFetch({
        query: /* GraphQL */ `
          mutation UpdateFilter($filter: UpdateFilterInput!, $filterId: ID!) {
            updateFilter(filter: $filter, filterId: $filterId) {
              _id
            }
          }
        `,
        variables: {
          filterId: 'non-existing-id',
          filter: {
            isActive: true,
            key: '999',
          },
        },
      });

      expect(errors[0]?.extensions?.code).toEqual('FilterNotFoundError');
    });

    it('return error when passed invalid filter ID', async () => {
      const { errors } = await graphqlFetch({
        query: /* GraphQL */ `
          mutation UpdateFilter($filter: UpdateFilterInput!, $filterId: ID!) {
            updateFilter(filter: $filter, filterId: $filterId) {
              _id
            }
          }
        `,
        variables: {
          filterId: '',
          filter: {
            isActive: true,
            key: '999',
          },
        },
      });

      expect(errors[0]?.extensions?.code).toEqual('InvalidIdError');
    });
  });

  describe('mutation.updateFilter for anonymous User', () => {
    it('return error', async () => {
      const graphqlAnonymousFetch = await createAnonymousGraphqlFetch();
      const { errors } = await graphqlAnonymousFetch({
        query: /* GraphQL */ `
          mutation UpdateFilter($filter: UpdateFilterInput!, $filterId: ID!) {
            updateFilter(filter: $filter, filterId: $filterId) {
              _id
            }
          }
        `,
        variables: {
          filterId: MultiChoiceFilter._id,
          filter: {
            isActive: true,
            key: '999',
          },
        },
      });

      expect(errors.length).toEqual(1);
    });
  });

  describe('mutation.removeFilter for admin User', () => {
    it('should remove filter successfuly when passed valid filter ID', async () => {
      await graphqlFetch({
        query: /* GraphQL */ `
          mutation RemoveFilter($filterId: ID!) {
            removeFilter(filterId: $filterId) {
              _id
              updated
              created
              isActive
              texts {
                _id
                locale
                title
                subtitle
              }
              type
              key
              options {
                _id
                value
                texts {
                  _id
                }
              }
            }
          }
        `,
        variables: {
          filterId: MultiChoiceFilter._id,
        },
      });

      const {
        data: { filter },
      } = await graphqlFetch({
        query: /* GraphQL */ `
          query Filter($filterId: ID!) {
            filter(filterId: $filterId) {
              _id
            }
          }
        `,
        variables: {
          filterId: MultiChoiceFilter._id,
        },
      });

      expect(filter).toBe(null);
    });

    it('return not found error when passed non existing filter ID', async () => {
      const { errors } = await graphqlFetch({
        query: /* GraphQL */ `
          mutation RemoveFilter($filterId: ID!) {
            removeFilter(filterId: $filterId) {
              _id
            }
          }
        `,
        variables: {
          filterId: 'non-existing-id',
        },
      });

      expect(errors[0]?.extensions?.code).toEqual('FilterNotFoundError');
    });

    it('return error when passed invalid filter ID', async () => {
      const { errors } = await graphqlFetch({
        query: /* GraphQL */ `
          mutation RemoveFilter($filterId: ID!) {
            removeFilter(filterId: $filterId) {
              _id
            }
          }
        `,
        variables: {
          filterId: '',
        },
      });

      expect(errors[0]?.extensions?.code).toEqual('InvalidIdError');
    });
  });

  describe('mutation.removeFilter for anonymous User', () => {
    it('return error', async () => {
      const graphqlAnonymousFetch = await createAnonymousGraphqlFetch();
      const { errors } = await graphqlAnonymousFetch({
        query: /* GraphQL */ `
          mutation RemoveFilter($filterId: ID!) {
            removeFilter(filterId: $filterId) {
              _id
            }
          }
        `,
        variables: {
          filterId: MultiChoiceFilter._id,
        },
      });

      expect(errors.length).toEqual(1);
    });
  });
});
