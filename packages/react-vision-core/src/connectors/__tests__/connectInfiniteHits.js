import connect from '../connectInfiniteHits';

jest.mock('../../core/createConnector', () => x => x);

describe('connectInfiniteHits', () => {
  describe('single index', () => {
    const contextValue = {
      mainTargetedIndex: 'index',
    };

    it('provides the current records to the component', () => {
      const records = [{}];
      const props = connect.getProvidedProps.call({}, { contextValue }, null, {
        results: { records, meta: { page: 0, perPage: 2, numPages: 3 } },
      });

      expect(props).toEqual({
        records: records.map(hit => expect.objectContaining(hit)),
        hasPrevious: false,
        hasMore: true,
        refinePrevious: expect.any(Function),
        refineNext: expect.any(Function),
      });
    });

    it('accumulate records internally', () => {
      const records = [{}, {}];
      const records2 = [{}, {}];
      const instance = {};

      const res1 = connect.getProvidedProps.call(
        instance,
        { contextValue },
        null,
        {
          results: { records, meta: { page: 0, perPage: 2, numPages: 3 } },
        }
      );

      expect(res1.records).toEqual(
        records.map(record => expect.objectContaining(record))
      );
      expect(res1.hasMore).toBe(true);

      const res2 = connect.getProvidedProps.call(
        instance,
        { contextValue },
        null,
        {
          results: {
            records: records2,
            meta: {
              page: 1,
              perPage: 2,
              numPages: 3,
            },
          },
        }
      );

      expect(res2.records).toEqual(
        [...records, ...records2].map(record => expect.objectContaining(record))
      );
      expect(res2.hasMore).toBe(true);
    });

    it('prepend records internally', () => {
      const instance = {};
      const initialPageRecords = [{}, {}];
      const previousPageRecords = [{}, {}];
      const initialPageProps = connect.getProvidedProps.call(
        instance,
        { contextValue },
        null,
        {
          results: {
            records: initialPageRecords,
            meta: {
              page: 1,
              perPage: 2,
              numPages: 3,
            },
          },
        }
      );

      expect(initialPageProps.records).toEqual(
        initialPageRecords.map(record => expect.objectContaining(record))
      );
      expect(initialPageProps.hasPrevious).toBe(true);

      const previousPageProps = connect.getProvidedProps.call(
        instance,
        { contextValue },
        null,
        {
          results: {
            records: previousPageRecords,
            meta: {
              page: 0,
              perPage: 2,
              numPages: 3,
            },
          },
        }
      );

      expect(previousPageProps.records).toEqual(
        [...previousPageRecords, ...initialPageRecords].map(record =>
          expect.objectContaining(record)
        )
      );
      expect(previousPageProps.hasPrevious).toBe(false);
    });

    it('accumulate records internally while changing perPage configuration', () => {
      const records = [{}, {}, {}, {}, {}, {}];
      const records2 = [{}, {}, {}, {}, {}, {}];
      const records3 = [{}, {}, {}, {}, {}, {}, {}, {}];
      const instance = {};

      const res1 = connect.getProvidedProps.call(
        instance,
        { contextValue },
        null,
        {
          results: {
            records,
            meta: {
              page: 0,
              perPage: 6,
              numPages: 10,
            },
          },
        }
      );

      expect(res1.records).toEqual(
        records.map(record => expect.objectContaining(record))
      );
      expect(res1.records.map(record => record.__position)).toEqual([
        1,
        2,
        3,
        4,
        5,
        6,
      ]);
      expect(res1.hasMore).toBe(true);

      const res2 = connect.getProvidedProps.call(
        instance,
        { contextValue },
        null,
        {
          results: {
            records: records2,
            meta: {
              page: 1,
              perPage: 6,
              numPages: 10,
            },
          },
        }
      );

      expect(res2.records).toEqual(
        [...records, ...records2].map(record => expect.objectContaining(record))
      );
      expect(res2.records.map(record => record.__position)).toEqual([
        // page 0
        1,
        2,
        3,
        4,
        5,
        6,
        // page 1
        7,
        8,
        9,
        10,
        11,
        12,
      ]);
      expect(res2.hasMore).toBe(true);

      let res3 = connect.getProvidedProps.call(
        instance,
        { contextValue },
        null,
        {
          results: {
            records: records3,
            meta: {
              page: 2,
              perPage: 8,
              numPages: 10,
            },
          },
        }
      );

      expect(res3.records).toEqual(
        [...records, ...records2, ...records3].map(record =>
          expect.objectContaining(record)
        )
      );
      expect(res3.records.map(record => record.__position)).toEqual([
        // page: 0, hitsPerPage: 6
        1,
        2,
        3,
        4,
        5,
        6,
        // page: 1, hitsPerPage: 6
        7,
        8,
        9,
        10,
        11,
        12,
        // hitsPerPage changed from 6 to 8, elements 13-16 are skipped
        // page: 2, hitsPerPage: 8
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
      ]);
      expect(res3.hasMore).toBe(true);

      // re-render with the same property
      res3 = connect.getProvidedProps.call(instance, { contextValue }, null, {
        results: {
          records: records3,
          meta: {
            page: 2,
            perPage: 8,
            numPages: 10,
          },
        },
      });

      expect(res3.records).toEqual(
        [...records, ...records2, ...records3].map(record =>
          expect.objectContaining(record)
        )
      );
      expect(res3.records.map(record => record.__position)).toEqual([
        // page: 0, hitsPerPage: 6
        1,
        2,
        3,
        4,
        5,
        6,
        // page: 1, hitsPerPage: 6
        7,
        8,
        9,
        10,
        11,
        12,
        // hitsPerPage changed from 6 to 8, elements 13-16 are skipped
        // page: 2, hitsPerPage: 8
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
      ]);
      expect(res3.hasMore).toBe(true);
    });

    it('should not reset while accumulating results', () => {
      const records = [{}, {}];
      const numPages = 5;
      const instance = {};

      let allRecords = [];
      for (let page = 0; page < numPages - 1; page++) {
        allRecords = [...allRecords, ...records];

        const res = connect.getProvidedProps.call(
          instance,
          { contextValue },
          null,
          {
            results: {
              records,
              meta: {
                page,
                perPage: records.length,
                numPages,
              },
            },
          }
        );

        expect(res.records).toEqual(
          allRecords.map(record => expect.objectContaining(record))
        );
        expect(res.records).toHaveLength((page + 1) * 2);
        expect(res.hasMore).toBe(true);
      }

      allRecords = [...allRecords, ...records];

      const res = connect.getProvidedProps.call(
        instance,
        { contextValue },
        null,
        {
          results: {
            records,
            meta: {
              page: numPages - 1,
              perPage: records.length,
              numPages,
            },
          },
        }
      );

      expect(res.records).toHaveLength(numPages * 2);
      expect(res.records).toEqual(
        allRecords.map(record => expect.objectContaining(record))
      );
      expect(res.records.map(record => record.__position)).toEqual([
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
      ]);
      expect(res.hasMore).toBe(false);
    });

    it('Indicates the last page after several pages', () => {
      const records = [{}, {}];
      const records2 = [{}, {}];
      const records3 = [{}];
      const instance = {};

      connect.getProvidedProps.call(instance, { contextValue }, null, {
        results: { records, meta: { page: 0, perPage: 2, numPages: 3 } },
      });

      connect.getProvidedProps.call(instance, { contextValue }, null, {
        results: {
          records: records2,
          meta: {
            page: 1,
            perPage: 2,
            numPages: 3,
          },
        },
      });

      const props = connect.getProvidedProps.call(
        instance,
        { contextValue },
        null,
        {
          results: {
            records: records3,
            meta: {
              page: 2,
              perPage: 2,
              numPages: 3,
            },
          },
        }
      );

      expect(props.records).toEqual(
        [...records, ...records2, ...records3].map(hit =>
          expect.objectContaining(hit)
        )
      );
      expect(props.hasMore).toBe(false);
    });

    it('calls refine with next page when calling refineNext', () => {
      const instance = { refine: jest.fn() };
      const records = [{}, {}];
      const event = new Event('click');

      const props = connect.getProvidedProps.call(
        instance,
        { contextValue },
        {},
        {
          results: {
            records,
            meta: {
              page: 2,
              perPage: 2,
              numPages: 3,
            },
          },
        }
      );

      props.refineNext.call(instance, event);

      expect(instance.refine).toHaveBeenCalledTimes(1);
      expect(instance.refine).toHaveBeenLastCalledWith(event, 3);
    });

    it('calls refine with previous page when calling refinePrevious', () => {
      const instance = { refine: jest.fn() };
      const records = [{}, {}];
      const event = new Event('click');

      const props = connect.getProvidedProps.call(
        instance,
        { contextValue },
        {},
        {
          results: {
            records,
            meta: {
              page: 2,
              perPage: 2,
              numPages: 3,
            },
          },
        }
      );

      props.refinePrevious.call(instance, event);

      expect(instance.refine).toHaveBeenCalledTimes(1);
      expect(instance.refine).toHaveBeenLastCalledWith(event, 1);
    });

    it('adds 1 to page when calling refine', () => {
      const props = { contextValue };
      const state0 = {};

      const state1 = connect.refine.call({}, props, state0);
      expect(state1).toEqual({ page: 2 });

      const state2 = connect.refine.call({}, props, state1);
      expect(state2).toEqual({ page: 3 });
    });

    it('set page to the corresponding index', () => {
      const props = { contextValue };
      const state0 = {};
      const event = new Event('click');
      const index = 5;

      const state1 = connect.refine.call({}, props, state0, event, index);
      // `index` is indexed from 0 but page number is indexed from 1
      expect(state1).toEqual({ page: 6 });
    });

    it('automatically converts String state to Number', () => {
      const props = { contextValue };
      const state0 = { page: '0' };

      const state1 = connect.refine.call({}, props, state0);
      expect(state1).toEqual({ page: 1 });
    });

    it('expect to always return an array of records', () => {
      const props = { contextValue };
      const searchState = {};

      // Retrieve the results from the cache that's why
      // the page it's not zero on the first render
      const searchResults = {
        results: {
          records: [{}, {}, {}],
          meta: {
            perPage: 3,
            page: 1,
            numPages: 3,
          },
        },
      };

      const expectation = {
        records: [{}, {}, {}].map(record => expect.objectContaining(record)),
        hasPrevious: true,
        hasMore: true,
        refinePrevious: expect.any(Function),
        refineNext: expect.any(Function),
      };

      const actual = connect.getProvidedProps.call(
        {},
        props,
        searchState,
        searchResults
      );

      expect(actual).toEqual(expectation);
    });
  });

  describe('multi index', () => {
    const contextValue = {
      mainTargetedIndex: 'first',
    };
    const indexContextValue = {
      targetedIndex: 'second',
    };

    it('provides the current records to the component', () => {
      const records = [{}];
      const props = connect.getProvidedProps.call(
        {},
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: { records, meta: { page: 0, perPage: 2, numPages: 3 } },
          },
        }
      );

      expect(props).toEqual({
        records: records.map(record => expect.objectContaining(record)),
        hasPrevious: false,
        hasMore: true,
        refinePrevious: expect.any(Function),
        refineNext: expect.any(Function),
      });
    });

    it('accumulate records internally', () => {
      const records = [{}, {}];
      const records2 = [{}, {}];

      const instance = {};

      const res1 = connect.getProvidedProps.call(
        instance,
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: { records, meta: { page: 0, perPage: 2, numPages: 3 } },
          },
        }
      );

      expect(res1.records).toEqual(
        records.map(record => expect.objectContaining(record))
      );
      expect(res1.hasMore).toBe(true);

      const res2 = connect.getProvidedProps.call(
        instance,
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: {
              records: records2,
              meta: { page: 1, perPage: 2, numPages: 3 },
            },
          },
        }
      );

      expect(res2.records).toEqual(
        [...records, ...records2].map(hit => expect.objectContaining(hit))
      );
      expect(res2.hasMore).toBe(true);
    });

    it('prepend records internally', () => {
      const initialPageRecords = [{}, {}];
      const previousPageRecords = [{}, {}];
      const instance = {};
      const initialPageProps = connect.getProvidedProps.call(
        instance,
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: {
              records: initialPageRecords,
              meta: {
                page: 1,
                perPage: 2,
                numPages: 3,
              },
            },
          },
        }
      );

      expect(initialPageProps.records).toEqual(
        initialPageRecords.map(record => expect.objectContaining(record))
      );
      expect(initialPageProps.hasPrevious).toBe(true);

      const previousPageProps = connect.getProvidedProps.call(
        instance,
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: {
              records: previousPageRecords,
              meta: {
                page: 0,
                perPage: 2,
                numPages: 3,
              },
            },
          },
        }
      );

      expect(previousPageProps.records).toEqual(
        [...previousPageRecords, ...initialPageRecords].map(hit =>
          expect.objectContaining(hit)
        )
      );
      expect(previousPageProps.hasPrevious).toBe(false);
    });

    it('accumulate records internally while changing perPage configuration', () => {
      const records = [{}, {}, {}, {}, {}, {}];
      const records2 = [{}, {}, {}, {}, {}, {}];
      const records3 = [{}, {}, {}, {}, {}, {}, {}, {}];
      const instance = {};

      const res1 = connect.getProvidedProps.call(
        instance,
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: { records, meta: { page: 0, perPage: 6, numPages: 10 } },
          },
        }
      );

      expect(res1.records).toEqual(
        records.map(record => expect.objectContaining(record))
      );
      expect(res1.hasMore).toBe(true);

      const res2 = connect.getProvidedProps.call(
        instance,
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: {
              records: records2,
              meta: { page: 1, perPage: 6, numPages: 10 },
            },
          },
        }
      );

      expect(res2.records).toEqual(
        [...records, ...records2].map(record => expect.objectContaining(record))
      );
      expect(res2.hasMore).toBe(true);

      let res3 = connect.getProvidedProps.call(
        instance,
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: {
              records: records3,
              meta: { page: 2, perPage: 8, numPages: 10 },
            },
          },
        }
      );

      expect(res3.records).toEqual(
        [...records, ...records2, ...records3].map(record =>
          expect.objectContaining(record)
        )
      );
      expect(res3.hasMore).toBe(true);

      // re-render with the same property
      res3 = connect.getProvidedProps.call(
        instance,
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: {
              records: records3,
              meta: { page: 2, perPage: 8, numPages: 10 },
            },
          },
        }
      );

      expect(res3.records).toEqual(
        [...records, ...records2, ...records3].map(record =>
          expect.objectContaining(record)
        )
      );
      expect(res3.hasMore).toBe(true);
    });

    it('should not accumulate records internally while changing query', () => {
      const instance = {};
      const records = [{}, {}, {}, {}, {}, {}];
      const records2 = [{}, {}, {}, {}, {}, {}];

      const res1 = connect.getProvidedProps.call(
        instance,
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: {
              records,
              meta: {
                page: 0,
                perPage: 6,
                numPages: 10,
              },
              _state: { page: 0, query: 'a' },
            },
          },
        }
      );

      expect(res1.records).toEqual(
        records.map(record => expect.objectContaining(record))
      );
      expect(res1.hasMore).toBe(true);

      const res2 = connect.getProvidedProps.call(
        instance,
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: {
              records: records2,
              meta: {
                page: 0,
                perPage: 6,
                numPages: 10,
              },
              _state: { page: 0, query: 'b' },
            },
          },
        }
      );

      expect(res2.records).toEqual(
        records2.map(record => expect.objectContaining(record))
      );
      expect(res2.hasMore).toBe(true);
    });

    it('should not reset while accumulating results', () => {
      const records = [{}, {}];
      const numPages = 100;
      const instance = {};

      let allRecords = [];
      for (let page = 0; page < numPages - 1; page++) {
        allRecords = [...allRecords, ...records];

        const res = connect.getProvidedProps.call(
          instance,
          { contextValue, indexContextValue },
          null,
          {
            results: {
              second: {
                records,
                meta: {
                  page,
                  perPage: records.length,
                  numPages,
                },
              },
            },
          }
        );

        expect(res.records).toEqual(
          allRecords.map(record => expect.objectContaining(record))
        );
        expect(res.records).toHaveLength((page + 1) * 2);
        expect(res.hasMore).toBe(true);
      }

      allRecords = [...allRecords, ...records];

      const res = connect.getProvidedProps.call(
        instance,
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: {
              records,
              meta: {
                page: numPages - 1,
                perPage: records.length,
                numPages,
              },
            },
          },
        }
      );

      expect(res.records).toHaveLength(numPages * 2);
      expect(res.records).toEqual(
        allRecords.map(hit => expect.objectContaining(hit))
      );
      expect(res.hasMore).toBe(false);
    });

    it('Indicates the last page after several pages', () => {
      const records = [{}, {}];
      const records2 = [{}, {}];
      const records3 = [{}];
      const instance = {};

      connect.getProvidedProps.call(
        instance,
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: { records, meta: { page: 0, perPage: 2, numPages: 3 } },
          },
        }
      );

      connect.getProvidedProps.call(
        instance,
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: {
              records: records2,
              meta: { page: 1, oerPage: 2, numPages: 3 },
            },
          },
        }
      );

      const props = connect.getProvidedProps.call(
        instance,
        { contextValue, indexContextValue },
        null,
        {
          results: {
            second: {
              records: records3,
              meta: { page: 2, perPage: 2, numPages: 3 },
            },
          },
        }
      );

      expect(props.records).toEqual(
        [...records, ...records2, ...records3].map(record =>
          expect.objectContaining(record)
        )
      );
      expect(props.hasMore).toBe(false);
    });
  });
});
