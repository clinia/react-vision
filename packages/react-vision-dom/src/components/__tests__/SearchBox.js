import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SearchBox from '../SearchBox';

Enzyme.configure({ adapter: new Adapter() });

describe('SearchBox', () => {
  it('applies its default props', () => {
    const instance = renderer.create(<SearchBox refine={() => null} />);

    expect(instance.toJSON()).toMatchSnapshot();

    instance.unmount();
  });
});
