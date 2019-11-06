import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SearchBox from '../SearchBox';
import LoadingIndicator from '../LoadingIndicator';
import { createClassNames } from '../../core/utils';

Enzyme.configure({ adapter: new Adapter() });

/*NOTES:
Tests that uses .dive() do that to get the inner component inside the hoc
To our tests it's necessary to retrieve the inner component to simulate events and etc
*/
describe('SearchBox', () => {
  const cx = createClassNames('SearchBox');
  it('applies its default props', () => {
    const instance = renderer.create(<SearchBox refine={() => null} />);

    expect(instance.toJSON()).toMatchSnapshot();

    instance.unmount();
  });

  it('should have focus after render when autoFocus prop is true', () => {
    //Creates a parent div where the component will be attached to
    //so that way we can get the active element id
    document.body.innerHTML = '<div></div>';

    const wrapper = mount(<SearchBox autoFocus={true} />, {
      attachTo: document.getElementsByName('div')[0],
    });

    const elementInstance = wrapper.find('input').instance();
    expect(elementInstance).toEqual(document.activeElement);
  });

  it('should initialize state with empty query', () => {
    const wrapper = shallow(<SearchBox />).dive();
    expect(wrapper.state('query')).toEqual('');
  });

  it('should render input disabled when "disabled" props is true', () => {
    const wrapper = shallow(<SearchBox disabled={true} />).dive();
    expect(wrapper.find('input').props('disabled')).toBeTruthy();
  });

  describe('Style tests', () => {
    it('should render main div with className props', () => {
      const classNameTest = 'class-test';
      const wrapper = shallow(<SearchBox className={classNameTest} />);

      expect(wrapper.first('div').hasClass(classNameTest)).toBeTruthy();
    });

    it('should render main div with style props ', () => {
      const styleTest = { top: 0 };
      const wrapper = shallow(<SearchBox style={styleTest} />);

      expect(wrapper.first('div').props().style).toEqual(styleTest);
    });
  });

  describe('Custom inner components', () => {
    it('should render with custom loading indicator', () => {
      const customLoadingIndicator = <span>Loading</span>;
      const wrapper = shallow(
        <SearchBox
          loadingIndicator={customLoadingIndicator}
          showLoadingIndicator={true}
          loading={true}
        />
      ).dive();
      const defaultLoadingIndicator = <LoadingIndicator />;

      expect(wrapper.contains(customLoadingIndicator)).toBeTruthy();
      expect(wrapper.contains(defaultLoadingIndicator)).toBeFalsy();
    });

    it('should not render with custom loading indicator when "showLoadingIndicator" props is false', () => {
      const customLoadingIndicator = <span>Loading</span>;
      const wrapper = shallow(
        <SearchBox
          loadingIndicator={customLoadingIndicator}
          showLoadingIndicator={false}
          loading={true}
        />
      );
      const defaultLoadingIndicator = <LoadingIndicator />;

      expect(wrapper.contains(customLoadingIndicator)).toBeFalsy();
      expect(wrapper.contains(defaultLoadingIndicator)).toBeFalsy();
    });

    it('should not render with custom loading indicator when "loading" props is false', () => {
      const customLoadingIndicator = <span>Loading</span>;
      const wrapper = shallow(
        <SearchBox
          loadingIndicator={customLoadingIndicator}
          loading={false}
          showLoadingIndicator={true}
        />
      );
      const defaultLoadingIndicator = <LoadingIndicator />;

      expect(wrapper.contains(customLoadingIndicator)).toBeFalsy();
      expect(wrapper.contains(defaultLoadingIndicator)).toBeFalsy();
    });

    it('should render with custom clear button', () => {
      const customClearButton = <button>Test</button>;
      const wrapper = shallow(
        <SearchBox clearButton={_ => customClearButton} />
      ).dive();

      expect(wrapper.contains(customClearButton)).toBeTruthy();
      expect(wrapper.exists('#search-box-clear')).toBeFalsy();
    });

    it('should render with custom submit button', () => {
      const customSubmitButton = <button>Test</button>;

      const wrapper = shallow(
        <SearchBox submitButton={customSubmitButton} />
      ).dive();

      expect(wrapper.contains(customSubmitButton)).toBeTruthy();
      expect(wrapper.exists('.search-box-button')).toBeFalsy();
    });
  });

  describe('Event tests', () => {
    describe('Default events', () => {
      it('should update state on default input change', () => {
        const wrapper = shallow(<SearchBox />).dive();
        const enteredInputValue = 'a';

        wrapper
          .find('input')
          .simulate('input', { target: { value: enteredInputValue } });

        expect(wrapper.state('query')).toEqual(enteredInputValue);
      });

      it('should not submit on default input change when "searchAsYouType" prop is not valid ', () => {
        const wrapper = shallow(<SearchBox />).dive();
        const enteredInputValue = 'a';
        const spyOnSubmit = spyOn(wrapper.instance(), 'onSubmit');

        wrapper
          .find('input')
          .simulate('input', { target: { value: enteredInputValue } });

        expect(wrapper.state().query).toEqual(enteredInputValue);
        expect(spyOnSubmit).not.toHaveBeenCalled();
      });

      it('should submit on default input change when "searchAsYouType" prop is true ', () => {
        //Mounts the inner component inside the hoc
        const wrapper = mount(
          shallow(<SearchBox searchAsYouType={true} />).get(0)
        );
        const enteredInputValue = 'a';
        const spyOnSubmit = spyOn(wrapper.instance(), 'onSubmit');

        wrapper
          .find('input')
          .simulate('input', { target: { value: enteredInputValue } });

        expect(wrapper.state().query).toEqual(enteredInputValue);
        expect(spyOnSubmit).toHaveBeenCalled();
      });
      it('should call submit on form submit', () => {
        const wrapper = shallow(<SearchBox />).dive();
        const spyOnSubmit = spyOn(wrapper.instance(), 'onSubmit');
        wrapper.instance().forceUpdate();

        wrapper.find('form').simulate('submit', { preventDefault: () => {} });

        expect(spyOnSubmit).toHaveBeenCalled();
      });
      it('should clear state on default clear search click', () => {
        const wrapper = shallow(<SearchBox />).dive();
        const enteredInputValue = 'a';

        //Simulate input to change the default state query value
        wrapper
          .find('input')
          .simulate('input', { target: { value: enteredInputValue } });

        expect(wrapper.state().query).toEqual(enteredInputValue);

        const clearElement = wrapper.find(`.${cx('clear')}`);
        clearElement.simulate('click');

        expect(wrapper.state().query).toEqual('');
      });
    });

    describe('Custom events', () => {
      it('should trigger onBlur on input blur', () => {
        const onBlur = jest.fn();

        const wrapper = shallow(<SearchBox onBlur={onBlur} />).dive();
        wrapper.find('input').simulate('blur');

        expect(onBlur).toHaveBeenCalled();
      });
      it('should trigger onChange on input change', () => {
        const onChange = jest.fn();

        const wrapper = shallow(<SearchBox onChange={onChange} />).dive();
        wrapper.find('input').simulate('change');

        expect(onChange).toHaveBeenCalled();
      });
      it('should trigger onClear on input change', () => {
        const onClear = jest.fn();

        const wrapper = shallow(<SearchBox onClear={onClear} />).dive();
        const clearElement = wrapper.find(`.${cx('clear')}`);
        clearElement.simulate('click');

        expect(onClear).toHaveBeenCalled();
      });
      it('should trigger onFocus on input focus', () => {
        const onFocus = jest.fn();

        const wrapper = shallow(<SearchBox onFocus={onFocus} />).dive();
        wrapper.find('input').simulate('focus');

        expect(onFocus).toHaveBeenCalled();
      });
      it('should trigger onInput on input change', () => {
        const onInput = jest.fn();
        const enteredInputValue = 'a';
        const wrapper = shallow(<SearchBox onInput={onInput} />).dive();
        wrapper
          .find('input')
          .simulate('input', { target: { value: enteredInputValue } });

        expect(onInput).toHaveBeenCalled();
      });
      it('should trigger onKeyPress on input change', () => {
        const onKeyPress = jest.fn();

        const wrapper = shallow(<SearchBox onKeyPress={onKeyPress} />).dive();
        wrapper.find('input').simulate('keyPress');

        expect(onKeyPress).toHaveBeenCalled();
      });
      it('should trigger onSubmit on input change', () => {
        const onSubmit = jest.fn();

        const wrapper = shallow(<SearchBox onSubmit={onSubmit} />).dive();
        wrapper.find('form').simulate('submit', { preventDefault: () => {} });

        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });
});
