import { parseCliniaHit } from '../highlight';

describe('parseCliniaHit()', () => {
  it('it does not break when there is a missing property', () => {
    const property = 'attr';
    const out = parseCliniaHit({
      property,
      hit: {},
      highlightProperty: '_highlight',
    });
    expect(out).toEqual([]);
  });

  it('creates a single element when there is no tag', () => {
    const value = 'foo bar baz';
    const property = 'attr';
    const out = parseCliniaHit({
      property,
      hit: createHit(property, value),
      highlightProperty: '_highlight',
    });
    expect(out).toEqual([{ isHighlighted: false, value }]);
  });

  it('creates a single element when there is only a tag', () => {
    const textValue = 'foo bar baz';
    const value = `<em>${textValue}</em>`;
    const property = 'attr';
    const out = parseCliniaHit({
      property,
      hit: createHit(property, value),
      highlightProperty: '_highlight',
    });
    expect(out).toEqual([{ value: textValue, isHighlighted: true }]);
  });

  it('fetches and parses a deep property', () => {
    const textValue = 'foo bar baz';
    const value = `<em>${textValue}</em>`;
    const hit = {
      lvl0: { lvl1: { lvl2: value } },
      _highlight: {
        lvl0: { lvl1: { lvl2: { value } } },
      },
    };
    const out = parseCliniaHit({
      property: 'lvl0.lvl1.lvl2',
      hit,
      highlightProperty: '_highlight',
    });
    expect(out).toEqual([{ value: textValue, isHighlighted: true }]);
  });

  it('parses the string and returns the part that are highlighted - 1 big highlight', () => {
    const str = 'like <em>al</em>golia does <em>al</em>golia';
    const hit = createHit('attr', str);
    const parsed = parseCliniaHit({
      property: 'attr',
      hit,
      highlightProperty: '_highlight',
    });
    expect(parsed).toEqual([
      { value: 'like ', isHighlighted: false },
      { value: 'al', isHighlighted: true },
      { value: 'golia does ', isHighlighted: false },
      { value: 'al', isHighlighted: true },
      { value: 'golia', isHighlighted: false },
    ]);
  });

  it('supports the array format, parses it and returns the part that is highlighted', () => {
    const hit = {
      tags: ['litterature', 'biology', 'photography'],
      _highlight: {
        tags: [
          { value: 'litterature' },
          { value: 'biology' },
          { value: '<em>photo</em>graphy' },
        ],
      },
    };

    const actual = parseCliniaHit({
      property: 'tags',
      hit,
      highlightProperty: '_highlight',
    });

    const exepectation = [
      [{ value: 'litterature', isHighlighted: false }],
      [{ value: 'biology', isHighlighted: false }],
      [
        { value: 'photo', isHighlighted: true },
        { value: 'graphy', isHighlighted: false },
      ],
    ];

    expect(actual).toEqual(exepectation);
  });

  it('parses the string and returns the part that are highlighted - same pre and post tag', () => {
    const str = 'surpise **lo**l mouhahah roflmao **lo**utre';
    const hit = createHit('attr', str);
    const parsed = parseCliniaHit({
      preTag: '**',
      postTag: '**',
      property: 'attr',
      hit,
      highlightProperty: '_highlight',
    });
    expect(parsed).toEqual([
      { value: 'surpise ', isHighlighted: false },
      { value: 'lo', isHighlighted: true },
      { value: 'l mouhahah roflmao ', isHighlighted: false },
      { value: 'lo', isHighlighted: true },
      { value: 'utre', isHighlighted: false },
    ]);
  });

  it('throws when hit is `null`', () => {
    expect(
      parseCliniaHit.bind(null, {
        property: 'unknownProperty',
        hit: null,
        highlightProperty: '_highlightResult',
      })
    ).toThrow('`hit`, the matching hit, must be provided');
  });

  it('throws when hit is `undefined`', () => {
    expect(
      parseCliniaHit.bind(null, {
        property: 'unknownProperty',
        hit: undefined,
        highlightProperty: '_highlightResult',
      })
    ).toThrow('`hit`, the matching hit, must be provided');
  });
});

function createHit(property, value) {
  return {
    [property]: value,
    _highlight: {
      [property]: { value },
    },
  };
}
