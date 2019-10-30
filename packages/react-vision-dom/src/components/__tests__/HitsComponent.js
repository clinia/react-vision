import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HitsComponent from '../HitsComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('HitsComponent', () => {
  it('applies its default props', () => {
    const instance = renderer.create(<HitsComponent refine={() => null} />);

    expect(instance.toJSON()).toMatchSnapshot();

    instance.unmount();
  });

  it('should render with default hit component', () => {});

  it('should render with default no results found', () => {});

  describe('Style tests', () => {
    it('should render main div with className props ', () => {});
    it('should render main div with style props ', () => {});
  });

  describe('Custom inner components', () => {
    it('should render with custom hit component', () => {});

    it('should render with custom noResultsFound component', () => {});
  });
});
