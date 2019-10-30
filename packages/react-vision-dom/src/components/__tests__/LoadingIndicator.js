import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';
import LoadingIndicator from '../LoadingIndicator';

Enzyme.configure({ adapter: new Adapter() });

describe('Loading Indicator', () => {
  it('applies its default props', () => {
    const instance = renderer.create(<LoadingIndicator refine={() => null} />);

    expect(instance.toJSON()).toMatchSnapshot();

    instance.unmount();
  });

  it('should render with .loading class when isLoading prop is true', () => {
    const wrapper = mount(<LoadingIndicator isLoading={true} />);
    expect(wrapper.exists('.loading')).toBeTruthy();
  });

  it('should not render with .loading class when isLoading prop is false', () => {
    const wrapper = mount(<LoadingIndicator isLoading={false} />);
    expect(wrapper.exists('.loading')).toBeFalsy();
  });
});
