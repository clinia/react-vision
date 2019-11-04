import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SearchBox from '../SearchBox';
import LoadingIndicator from '../LoadingIndicator';

Enzyme.configure({ adapter: new Adapter() });

describe('SearchBox', () => {
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

    const element = wrapper.find('input');
    expect(element.props().id).toEqual(document.activeElement.id);
  });

  it('should initialize state with empty query', () => {
    const wrapper = shallow(<SearchBox />);
    expect(wrapper.state('query')).toEqual('');
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
      );
      const defaultLoadingIndicator = <LoadingIndicator />;

      expect(wrapper.contains(customLoadingIndicator)).toBeTruthy();
      expect(wrapper.contains(defaultLoadingIndicator)).toBeFalsy();
    });

    it('should render with custom clear button', () => {
      const customClearButton = <button>Test</button>;
      const wrapper = shallow(
        <SearchBox clearButton={_ => customClearButton} />
      );

      expect(wrapper.contains(customClearButton)).toBeTruthy();
      expect(wrapper.exists('#search-box-clear')).toBeFalsy();
    });

    it('should render with custom submit button', () => {
      const customSubmitButton = <button>Test</button>;
      const wrapper = shallow(<SearchBox submitButton={customSubmitButton} />);

      expect(wrapper.contains(customSubmitButton)).toBeTruthy();
      expect(wrapper.exists('.search-box-button')).toBeFalsy();
    });
  });

  describe('Event tests', () => {
    describe('Default events', () => {
      it('should update state on default input change', () => {
        const wrapper = shallow(<SearchBox />);
        const enteredInputValue = 'a';

        wrapper
          .find('input')
          .simulate('input', { target: { value: enteredInputValue } });

        expect(wrapper.state('query')).toEqual(enteredInputValue);
      });

      it('should not submit on default input change when "searchAsYouType" prop is not valid ', () => {
        const wrapper = shallow(<SearchBox />);
        const enteredInputValue = 'a';
        const spyOnSubmit = spyOn(wrapper.instance(), 'onSubmit');

        wrapper
          .find('input')
          .simulate('input', { target: { value: enteredInputValue } });

        expect(wrapper.state().query).toEqual(enteredInputValue);
        expect(spyOnSubmit).not.toHaveBeenCalled();
      });

      it('should submit on default input change when "searchAsYouType" prop is true ', () => {
        const wrapper = mount(<SearchBox searchAsYouType={true} />);
        const enteredInputValue = 'a';
        const spyOnSubmit = spyOn(wrapper.instance(), 'onSubmit');

        wrapper
          .find('input')
          .simulate('input', { target: { value: enteredInputValue } });

        expect(wrapper.state().query).toEqual(enteredInputValue);
        expect(spyOnSubmit).toHaveBeenCalled();
      });
      it('should submit on button submit', () => {
        const spyOnSubmit = spyOn(SearchBox.prototype, 'onSubmit');
        const wrapper = mount(<SearchBox />);

        wrapper.find('button').simulate('submit');

        expect(spyOnSubmit).toHaveBeenCalled();
      });
      it('should clear state on default clear search click', () => {
        const wrapper = shallow(<SearchBox />);
        const enteredInputValue = 'a';

        //Simulate input to change the default state query value
        wrapper
          .find('input')
          .simulate('input', { target: { value: enteredInputValue } });

        expect(wrapper.state().query).toEqual(enteredInputValue);
        wrapper.find('#search-box-clear').simulate('click');
        expect(wrapper.state().query).toEqual('');
      });
    });

    describe('Custom events', () => {
      it('should trigger onBlur on input blur', () => {
        const onBlur = jest.fn();

        const wrapper = shallow(<SearchBox onBlur={onBlur} />);
        wrapper.find('input').simulate('blur');

        expect(onBlur).toHaveBeenCalled();
      });
      it('should trigger onChange on input change', () => {
        const onChange = jest.fn();

        const wrapper = shallow(<SearchBox onChange={onChange} />);
        wrapper.find('input').simulate('change');

        expect(onChange).toHaveBeenCalled();
      });
      it('should trigger onClear on input change', () => {
        const onClear = jest.fn();

        const wrapper = shallow(<SearchBox onClear={onClear} />);
        wrapper.find('#search-box-clear').simulate('click');

        expect(onClear).toHaveBeenCalled();
      });
      it('should trigger onFocus on input focus', () => {
        const onFocus = jest.fn();

        const wrapper = shallow(<SearchBox onFocus={onFocus} />);
        wrapper.find('input').simulate('focus');

        expect(onFocus).toHaveBeenCalled();
      });
      it('should trigger onInput on input change', () => {
        const onInput = jest.fn();
        const enteredInputValue = 'a';
        const wrapper = shallow(<SearchBox onInput={onInput} />);
        wrapper
          .find('input')
          .simulate('input', { target: { value: enteredInputValue } });

        expect(onInput).toHaveBeenCalled();
      });
      it('should trigger onKeyPress on input change', () => {
        const onKeyPress = jest.fn();

        const wrapper = shallow(<SearchBox onKeyPress={onKeyPress} />);
        wrapper.find('input').simulate('keyPress');

        expect(onKeyPress).toHaveBeenCalled();
      });
      it('should trigger onSubmit on input change', () => {
        const onSubmit = jest.fn();

        const wrapper = shallow(<SearchBox onSubmit={onSubmit} />);
        wrapper.find('form').simulate('submit', { preventDefault: () => {} });

        expect(onSubmit).toHaveBeenCalled();
      });
    });
  });
});
