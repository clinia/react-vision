import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DefaultHitComponent from '../DefaultHitComponent';

Enzyme.configure({ adapter: new Adapter() });

describe('DefaultHitComponent', () => {
  const searchResult = { id: '1', resourceName: 'Test', note: 'test' };

  it('applies its default props', () => {
    const instance = renderer.create(
      <DefaultHitComponent searchResult={searchResult} refine={() => null} />
    );

    expect(instance.toJSON()).toMatchSnapshot();

    instance.unmount();
  });

  it('should render with the resource name in the title', () => {
    const wrapper = shallow(
      <DefaultHitComponent searchResult={searchResult} />
    );
    const titleElement = wrapper.find('.default-hit-title');

    expect(titleElement.text()).toEqual(searchResult.resourceName);
  });

  it('should render with the resource as a JSON in the card body', () => {
    const wrapper = shallow(
      <DefaultHitComponent searchResult={searchResult} />
    );
    const cardBodyElement = wrapper.find('.card-body');

    const expectedResult = JSON.stringify(searchResult, null, 2);

    expect(cardBodyElement.text()).toEqual(expectedResult);
  });
});
