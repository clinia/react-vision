import React from 'react';
import renderer from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16';
import Hits from '../Hits';
import Enzyme, { shallow, mount } from 'enzyme';
import { createClassNames } from '../../core/utils';

Enzyme.configure({ adapter: new Adapter() });

describe('Hits', () => {
  const cx = createClassNames('Hits');
  it('applies its default props', () => {
    const instance = renderer.create(<Hits refine={() => null} />);

    expect(instance.toJSON()).toMatchSnapshot();

    instance.unmount();
  });

  it('should render with default hit component', () => {
    const results = [{ id: '123', name: 'test' }];
    const wrapper = shallow(<Hits results={results} />);

    expect(wrapper.exists('.default-hit-card')).toBeFalsy();
  });

  it('should render with default no results found', () => {
    const wrapper = mount(<Hits />);
    expect(wrapper.exists(`.${cx('empty')}`)).toBeTruthy();
  });

  describe('Style tests', () => {
    it('should render main div with className props ', () => {
      const classNameTest = 'class-test';
      const wrapper = shallow(<Hits className={classNameTest} />);

      expect(wrapper.first('div').hasClass(classNameTest)).toBeTruthy();
    });

    it('should render main div with style props ', () => {
      const styleTest = { top: 0 };
      const wrapper = shallow(<Hits style={styleTest} />);

      expect(wrapper.first('div').props().style).toEqual(styleTest);
    });
  });

  describe('Custom inner components', () => {
    it('should render with custom hit component', () => {
      const results = [{ id: '123', name: 'test' }];
      const customHitComponent = <h1>Test</h1>;
      const wrapper = shallow(
        <Hits results={results} hit={_ => customHitComponent} />
      );

      expect(wrapper.contains(customHitComponent)).toBeTruthy();
      expect(wrapper.exists('.default-hit-no-results-found')).toBeFalsy();
    });

    it('should render with custom noResultsFound component', () => {
      const customNoResultsFound = <h1>Test</h1>;

      const wrapper = shallow(<Hits noResultsFound={customNoResultsFound} />);

      expect(wrapper.contains(customNoResultsFound)).toBeTruthy();
    });
  });

  describe('DefaultHit', () => {
    it('should render with DefaultHit with resource id in the title', () => {
      const results = [{ id: '123', name: 'test' }];
      const wrapper = mount(<Hits results={results} />);
      const titleElement = wrapper.find('.default-hit-title');

      expect(titleElement.text()).toEqual(results[0].id);
    });

    it('should render DefaultHit with the resource as a JSON in the card body', () => {
      const results = [{ id: '123', name: 'test' }];
      const wrapper = mount(<Hits results={results} />);

      const cardBodyElement = wrapper.find('.card-body');

      const expectedResult = JSON.stringify(results[0], null, 2);

      expect(cardBodyElement.text()).toEqual(expectedResult);
    });
  });
});
