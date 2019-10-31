import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HitsComponent from '../HitsComponent';
import DefaultHitComponent from '../DefaultHitComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('HitsComponent', () => {
  const results = [{ resourceId: '123', resourceName: 'test' }];

  it('applies its default props', () => {
    //@ts-ignore
    const instance = renderer.create(<HitsComponent refine={() => null} />);

    expect(instance.toJSON()).toMatchSnapshot();

    instance.unmount();
  });

  it('should render with default hit component', () => {
    const wrapper = shallow(<HitsComponent results={results} />);
    const defaultHitComponent = (
      <DefaultHitComponent searchResult={results[0]} />
    );

    expect(wrapper.containsMatchingElement(defaultHitComponent)).toBeTruthy();
    expect(wrapper.exists('.default-hit-no-results-found')).toBeFalsy();
  });

  it('should render with default no results found', () => {
    const wrapper = shallow(<HitsComponent results={[]} />);

    expect(wrapper.exists('.default-hit-no-results-found')).toBeTruthy();
  });

  describe('Style tests', () => {
    it('should render main div with className props ', () => {
      const classNameTest = 'class-test';
      const wrapper = shallow(
        <HitsComponent className={classNameTest} results={[]} />
      );

      expect(wrapper.first('div').hasClass(classNameTest)).toBeTruthy();
    });

    it('should render main div with style props ', () => {
      const styleTest = { top: 0 };
      const wrapper = shallow(<HitsComponent style={styleTest} results={[]} />);

      expect(wrapper.first('div').props().style).toEqual(styleTest);
    });
  });

  describe('Custom inner components', () => {
    it('should render with custom hit component', () => {
      const customHitComponent = <h1>Test</h1>;
      const wrapper = shallow(
        <HitsComponent results={results} hit={_ => customHitComponent} />
      );

      expect(wrapper.contains(customHitComponent)).toBeTruthy();
      expect(wrapper.exists('.default-hit-no-results-found')).toBeFalsy();
    });

    it('should render with custom noResultsFound component', () => {
      const customNoResultsFound = <h1>Test</h1>;

      const wrapper = shallow(
        <HitsComponent noResultsFound={customNoResultsFound} results={[]} />
      );

      expect(wrapper.contains(customNoResultsFound)).toBeTruthy();
    });
  });
});
