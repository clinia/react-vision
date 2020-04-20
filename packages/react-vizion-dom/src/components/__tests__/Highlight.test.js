import React from 'react';
import renderer from 'react-test-renderer';
import Highlight from '../Highlight';

describe('Highlight', () => {
  it('parses an highlighted property of hit object', () => {
    const hitFromAPI = {
      id: 0,
      deep: { property: { value: 'awesome highlighted hit!' } },
      _highlight: {
        deep: {
          property: {
            value: {
              value:
                'awesome <cvi-highlight>hi</cvi-highlight>ghlighted <cvi-highlight>hi</cvi-highlight>t!',
              fullyHighlighted: true,
              matchLevel: 'full',
              matchedWords: [''],
            },
          },
        },
      },
    };

    const highlight = () => [
      { value: 'awesome ', isHighlighted: false },
      { value: 'hi', isHighlighted: true },
      { value: 'ghlighted ', isHighlighted: false },
      { value: 'hi', isHighlighted: true },
      { value: 't!', isHighlighted: false },
    ];

    const tree = renderer.create(
      <Highlight
        cx={(...x) => x.join(' ')}
        property="deep.property.value"
        hit={hitFromAPI}
        highlight={highlight}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders a hit with a custom tag correctly', () => {
    const hitFromAPI = {
      objectID: 0,
      deep: { property: { value: 'awesome highlighted hit!' } },
      _highlight: {
        deep: {
          property: {
            value: {
              value:
                'awesome <cvi-highlight>hi</cvi-highlight>ghlighted <cvi-highlight>hi</cvi-highlight>t!',
              fullyHighlighted: true,
              matchLevel: 'full',
              matchedWords: [''],
            },
          },
        },
      },
    };

    const highlight = () => [
      { value: 'awesome ', isHighlighted: false },
      { value: 'hi', isHighlighted: true },
      { value: 'ghlighted ', isHighlighted: false },
      { value: 'hi', isHighlighted: true },
      { value: 't!', isHighlighted: false },
    ];

    const tree = renderer.create(
      <Highlight
        cx={(...x) => x.join(' ')}
        property="deep.property.value"
        hit={hitFromAPI}
        highlight={highlight}
        tagName="marquee"
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders a hit with a custom className', () => {
    const hitFromAPI = {
      id: 0,
      deep: { property: { value: 'awesome highlighted hit!' } },
      _highlight: {
        deep: {
          property: {
            value: {
              value:
                'awesome <cvi-highlight>hi</cvi-highlight>ghlighted <cvi-highlight>hi</cvi-highlight>t!',
              fullyHighlighted: true,
              matchLevel: 'full',
              matchedWords: [''],
            },
          },
        },
      },
    };

    const highlight = () => [
      { value: 'awesome ', isHighlighted: false },
      { value: 'hi', isHighlighted: true },
      { value: 'ghlighted ', isHighlighted: false },
      { value: 'hi', isHighlighted: true },
      { value: 't!', isHighlighted: false },
    ];

    const tree = renderer.create(
      <Highlight
        cx={(...x) => x.join(' ')}
        className="MyCustomHighlight"
        property="deep.property.value"
        hit={hitFromAPI}
        highlight={highlight}
      />
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
