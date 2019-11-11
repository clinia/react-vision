import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import AutoComplete from '../AutoComplete';

Enzyme.configure({ adapter: new Adapter() });

describe('SearchBox', () => {
  it('applies its default props', () => {
    const instance = renderer.create(<AutoComplete refine={() => null} />);

    expect(instance.toJSON()).toMatchSnapshot();

    instance.unmount();
  });

  it('applies its default props with custom className', () => {});
  it('applies its default props with custom style', () => {});
  it('transfers the autoFocus prop to the underlying input element', () => {});
  it('transfers the disabled prop to the underlying input element', () => {});
  it('lets you give custom components for clear and submit', () => {});
  it('lets you customize its translations', () => {});
  it('should render the loader if showLoadingIndicator is true', () => {});
  it('onSubmit behavior should be override if provided as props', () => {});
  it('should accept `on*` events', () => {});
});
