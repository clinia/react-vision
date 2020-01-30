import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import AutoComplete from '../AutoComplete';

Enzyme.configure({ adapter: new Adapter() });

describe('AutoComplete', () => {
  describe('Snapshot testing', () => {
    it('applies its default props', () => {
      const instance = renderer.create(<AutoComplete refine={() => null} />);

      expect(instance.toJSON()).toMatchSnapshot();

      instance.unmount();
    });

    it('applies its default props with custom className', () => {
      const instance = renderer.create(
        <AutoComplete
          refine={() => null}
          searchForSuggestions={() => null}
          className="custom"
        />
      );

      expect(instance.toJSON()).toMatchSnapshot();

      instance.unmount();
    });

    it('applies its default props with custom style', () => {
      const instance = renderer.create(
        <AutoComplete
          refine={() => null}
          searchForSuggestions={() => null}
          style={{ color: 'lightgray' }}
        />
      );

      expect(instance.toJSON()).toMatchSnapshot();

      instance.unmount();
    });

    it('transfers the autoFocus prop to the underlying input element', () => {
      const instance = renderer.create(
        <AutoComplete
          refine={() => null}
          searchForSuggestions={() => null}
          autoFocus
        />
      );

      expect(instance.toJSON()).toMatchSnapshot();

      instance.unmount();
    });

    it('transfers the disabled prop to the underlying input element', () => {
      const instance = renderer.create(
        <AutoComplete
          refine={() => null}
          searchForSuggestions={() => null}
          disabled
        />
      );

      expect(instance.toJSON()).toMatchSnapshot();

      instance.unmount();
    });
    it('lets you give custom components for clear submit', () => {
      const instance = renderer.create(
        <AutoComplete
          refine={() => null}
          searchForSuggestions={() => null}
          submit={<span>🔍</span>}
        />
      );

      expect(instance.toJSON()).toMatchSnapshot();

      instance.unmount();
    });
    it('lets you give custom components for submit', () => {
      const instance = renderer.create(
        <AutoComplete
          refine={() => null}
          searchForSuggestions={() => null}
          clear={
            <svg viewBox="200 198 108 122">
              <path d="M200.8 220l45 46.7-20 47.4 31.7-34 50.4 39.3-34.3-52.6 30.2-68.3-49.7 51.7" />
            </svg>
          }
        />
      );

      expect(instance.toJSON()).toMatchSnapshot();

      instance.unmount();
    });
    it('lets you give custom components for loading indicator', () => {
      const instance = renderer.create(
        <AutoComplete
          refine={() => null}
          searchForSuggestions={() => null}
          submit={<span>🔍</span>}
          loadingIndicator={
            <svg viewBox="200 198 108 122">
              <path d="M200.8 220l45 46.7-20 47.4 31.7-34 50.4 39.3-34.3-52.6 30.2-68.3-49.7 51.7" />
            </svg>
          }
        />
      );

      expect(instance.toJSON()).toMatchSnapshot();

      instance.unmount();
    });
    it('lets you customize its translations', () => {
      const instance = renderer.create(
        <AutoComplete
          refine={() => null}
          searchForSuggestions={() => null}
          translations={{
            clearTitle: 'CLEAR_TITLE',
            placeholder: 'PLACEHOLDER',
          }}
        />
      );

      expect(instance.toJSON()).toMatchSnapshot();

      instance.unmount();
    });

    it('lets you give a custom theme key', () => {
      const instance = renderer.create(
        <AutoComplete
          refine={() => null}
          searchForSuggestions={() => null}
          customThemeKey="Test"
        />
      );

      expect(instance.toJSON()).toMatchSnapshot();

      instance.unmount();
    });

    it('should render the loader if showLoadingIndicator is true', () => {
      const instanceWithoutLoadingIndicator = renderer.create(
        <AutoComplete
          refine={() => null}
          searchForSuggestions={() => null}
          showLoadingIndicator
        />
      );

      expect(instanceWithoutLoadingIndicator.toJSON()).toMatchSnapshot();

      const instanceWithLoadingIndicator = renderer.create(
        <AutoComplete
          refine={() => null}
          searchForSuggestions={() => null}
          showLoadingIndicator
          isSearchStalled
        />
      );

      expect(instanceWithLoadingIndicator.toJSON()).toMatchSnapshot();

      instanceWithoutLoadingIndicator.unmount();
      instanceWithLoadingIndicator.unmount();
    });
  });

  describe('component behavior', () => {
    it('onSubmit behavior should be override if provided as props', () => {
      const onSubmit = jest.fn();
      const refine = jest.fn();
      const searchForSuggestions = jest.fn();
      const wrapper = mount(
        <AutoComplete
          onSubmit={onSubmit}
          refine={refine}
          searchForSuggestions={searchForSuggestions}
        />
      );

      wrapper.find('form').simulate('submit');

      expect(onSubmit).toHaveBeenCalled();
      expect(refine).not.toHaveBeenCalled();

      wrapper.unmount();
    });

    it('should accept `on*` events', () => {
      const onSubmit = jest.fn();
      const onClear = jest.fn();

      const inputEventsList = [
        'onChange',
        'onFocus',
        'onBlur',
        'onSelect',
        'onKeyDown',
        'onKeyPress',
      ];

      const inputProps = inputEventsList.reduce(
        (props, prop) => ({ ...props, [prop]: jest.fn() }),
        {}
      );

      const wrapper = mount(
        <AutoComplete
          refine={() => null}
          searchForSuggestions={() => null}
          onSubmit={onSubmit}
          onClear={onClear}
          {...inputProps}
        />
      );

      wrapper.find('form').simulate('submit');
      expect(onSubmit).toHaveBeenCalled();

      wrapper.find('form').simulate('reset');
      expect(onClear).toHaveBeenCalled();

      inputEventsList.forEach(eventName => {
        wrapper
          .find('input')
          .simulate(eventName.replace(/^on/, '').toLowerCase());

        expect(inputProps[eventName]).toHaveBeenCalled();
      });

      wrapper.unmount();
    });
  });
});
