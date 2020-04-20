import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Highlighter, { Highlight } from '../Highlighter';

Enzyme.configure({ adapter: new Adapter() });

describe('Highlighter - Highlight', () => {
  const defaultProps = {
    value: 'test',
    highlightedTagName: 'em',
    isHighlighted: false,
    nonHighlightedTagName: 'div',
  };

  it('renders a highlight', () => {
    const props = {
      ...defaultProps,
      isHighlighted: true,
    };

    const wrapper = shallow(
      <Highlight cx={(...x) => x.join(' ')} {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders a nonhighlight', () => {
    const props = {
      ...defaultProps,
    };

    const wrapper = shallow(
      <Highlight cx={(...x) => x.join(' ')} {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});

describe('Highlighter - simple', () => {
  const hitFromAPI = {
    id: 3,
    title: 'Apple',
    _highlight: {
      title: {
        value: '<cvi-highlight>Ap</cvi-highlight>ple',
      },
    },
  };

  const defaultProps = {
    hit: hitFromAPI,
    property: 'title',
    highlightProperty: '_highlight',
  };

  it('renders a highlighted value', () => {
    const props = {
      ...defaultProps,
      highlight: () => [
        { value: 'Ap', isHighlighted: true },
        { value: 'ple', isHighlighted: false },
      ],
    };

    const wrapper = shallow(
      <Highlighter cx={(...x) => x.join(' ')} {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders a non highlighted value', () => {
    const props = {
      ...defaultProps,
      hit: {
        id: 3,
        title: 'Apple',
        _highlight: {
          title: {
            value: 'Apple',
          },
        },
      },
      highlight: () => [{ value: 'Apple', isHighlighted: false }],
    };

    const wrapper = shallow(
      <Highlighter cx={(...x) => x.join(' ')} {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders a highlighted value with a custom tagName', () => {
    const props = {
      ...defaultProps,
      tagName: 'strong',
      highlight: () => [
        { value: 'Ap', isHighlighted: true },
        { value: 'ple', isHighlighted: false },
      ],
    };

    const wrapper = shallow(
      <Highlighter cx={(...x) => x.join(' ')} {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders a highlighted value with a custom nonHighlightedTagName', () => {
    const props = {
      ...defaultProps,
      nonHighlightedTagName: 'p',
      highlight: () => [
        { value: 'Ap', isHighlighted: true },
        { value: 'ple', isHighlighted: false },
      ],
    };

    const wrapper = shallow(
      <Highlighter cx={(...x) => x.join(' ')} {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders with a custom className', () => {
    const props = {
      ...defaultProps,
      className: 'MyCustomHighlighter',
      highlight: () => [
        { value: 'Ap', isHighlighted: true },
        { value: 'ple', isHighlighted: false },
      ],
    };

    const wrapper = shallow(
      <Highlighter cx={(...x) => x.join(' ')} {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});

describe('Highlighter - multi', () => {
  const hitFromAPI = {
    id: 3,
    titles: ['Apple', 'Samsung', 'Philips'],
    _highlight: {
      titles: [
        {
          value: 'Apple',
        },
        {
          value: '<cvi-highlight>Sam</cvi-highlight>sung',
        },
        {
          value: 'Philips',
        },
      ],
    },
  };

  const defaultProps = {
    hit: hitFromAPI,
    property: 'titles',
    highlightProperty: '_highlight',
  };

  it('renders a highlighted value', () => {
    const props = {
      ...defaultProps,
      highlight: () => [
        [{ value: 'Apple', isHighlighted: false }],
        [
          { value: 'Sam', isHighlighted: true },
          { value: 'sung', isHighlighted: false },
        ],
        [{ value: 'Philips', isHighlighted: false }],
      ],
    };

    const wrapper = shallow(
      <Highlighter cx={(...x) => x.join(' ')} {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders a non highlighted value', () => {
    const props = {
      ...defaultProps,
      hit: {
        id: 3,
        titles: ['Apple', 'Samsung', 'Philips'],
        _highlight: {
          titles: [
            {
              value: 'Apple',
            },
            {
              value: 'Samsung',
            },
            {
              value: 'Philips',
            },
          ],
        },
      },
      highlight: () => [
        [{ value: 'Apple', isHighlighted: false }],
        [{ value: 'Samsung', isHighlighted: false }],
        [{ value: 'Philips', isHighlighted: false }],
      ],
    };

    const wrapper = shallow(
      <Highlighter cx={(...x) => x.join(' ')} {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders a highlighted value with a custom tagName', () => {
    const props = {
      ...defaultProps,
      tagName: 'strong',
      highlight: () => [
        [{ value: 'Apple', isHighlighted: false }],
        [
          { value: 'Sam', isHighlighted: true },
          { value: 'sung', isHighlighted: false },
        ],
        [{ value: 'Philips', isHighlighted: false }],
      ],
    };

    const wrapper = shallow(
      <Highlighter cx={(...x) => x.join(' ')} {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders a highlighted value with a custom nonHighlightedTagName', () => {
    const props = {
      ...defaultProps,
      nonHighlightedTagName: 'p',
      highlight: () => [
        [{ value: 'Apple', isHighlighted: false }],
        [
          { value: 'Sam', isHighlighted: true },
          { value: 'sung', isHighlighted: false },
        ],
        [{ value: 'Philips', isHighlighted: false }],
      ],
    };

    const wrapper = shallow(
      <Highlighter cx={(...x) => x.join(' ')} {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders a highlighted value with a custom separator', () => {
    const props = {
      ...defaultProps,
      separator: '-',
      highlight: () => [
        [{ value: 'Apple', isHighlighted: false }],
        [
          { value: 'Sam', isHighlighted: true },
          { value: 'sung', isHighlighted: false },
        ],
        [{ value: 'Philips', isHighlighted: false }],
      ],
    };

    const wrapper = shallow(
      <Highlighter cx={(...x) => x.join(' ')} {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders a custom className', () => {
    const props = {
      ...defaultProps,
      className: 'MyCustomHighlighter',
      highlight: () => [
        [{ value: 'Apple', isHighlighted: false }],
        [
          { value: 'Sam', isHighlighted: true },
          { value: 'sung', isHighlighted: false },
        ],
        [{ value: 'Philips', isHighlighted: false }],
      ],
    };

    const wrapper = shallow(
      <Highlighter cx={(...x) => x.join(' ')} {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
