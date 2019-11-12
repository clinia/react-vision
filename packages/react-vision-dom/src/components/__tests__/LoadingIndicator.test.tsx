import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import LoadingIndicator from '../LoadingIndicator';

Enzyme.configure({ adapter: new Adapter() });

describe('Loading Indicator', () => {
  it('applies its default props', () => {
    const instance = renderer.create(<LoadingIndicator />);

    expect(instance.toJSON()).toMatchSnapshot();

    instance.unmount();
  });
});
