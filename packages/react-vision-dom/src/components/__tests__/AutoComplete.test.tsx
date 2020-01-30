import React from 'react';
import renderer from 'react-test-renderer';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import AutoComplete from '../AutoComplete';
import { createClassNames } from '../../core/utils';

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

    // describe('on empty input', () => {
    //   const cx = createClassNames('AutoComplete');
    //   const mockSuggestions = [
    //     {
    //       suggestion: 'Suggestion 1',
    //     },
    //     {
    //       suggestion: 'Suggestion 2',
    //     },
    //     {
    //       suggestion: 'Suggestion 3',
    //     },
    //   ];
    //   const suggestionCompliantChar = 's';

    //   describe('after entering suggestions-compliant char', () => {
    //     let wrapper;
    //     let input;
    //     let getSuggestionsElements;
    //     beforeEach(() => {
    //       wrapper = shallow(
    //         <AutoComplete
    //           refine={() => null}
    //           searchForSuggestions={() => null}
    //           suggestions={mockSuggestions}
    //         />
    //       ).dive();

    //       getSuggestionsElements = () =>
    //         wrapper.find(`.${cx('suggestion-list')}`).children();

    //       input = wrapper.find('input');

    //       input.simulate('focus');
    //       input.simulate('change', {
    //         target: { value: suggestionCompliantChar },
    //       });
    //     });

    //     afterEach(() => {
    //       wrapper = null;
    //       input = null;
    //     });

    //     it('should highlight the first suggestion when down arrow key pressed', () => {
    //       input.simulate('keydown', { preventDefault: jest.fn(), keyCode: 40 });

    //       const elements = getSuggestionsElements();

    //       expect(
    //         elements.first().hasClass(cx('active-suggestion'))
    //       ).toBeTruthy();
    //     });

    //     it('should not highlight any suggestion after down key pressed on the last suggestion', () => {
    //       mockSuggestions.forEach(_ =>
    //         input.simulate('keydown', {
    //           preventDefault: jest.fn(),
    //           keyCode: 40,
    //         })
    //       );

    //       const activeSuggestionClass = cx('active-suggestion');
    //       const elements = getSuggestionsElements();

    //       expect(elements.exists(`.${activeSuggestionClass}`)).toBeTruthy();
    //       expect(elements.last().hasClass(activeSuggestionClass)).toBeTruthy();

    //       input.simulate('keydown', { preventDefault: jest.fn(), keyCode: 40 });

    //       const updatedElements = getSuggestionsElements();

    //       expect(
    //         updatedElements.exists(`.${activeSuggestionClass}`)
    //       ).toBeFalsy();
    //     });

    //     it('should highlight the last suggestion when up arrow key pressed', () => {
    //       input.simulate('keydown', { preventDefault: jest.fn(), keyCode: 38 });

    //       const elements = getSuggestionsElements();

    //       expect(elements.last().hasClass(cx('suggestion'))).toBeTruthy();
    //       expect(
    //         elements.last().hasClass(cx('active-suggestion'))
    //       ).toBeTruthy();
    //     });

    //     it('should not highlight any suggestion after up key pressed on the first suggestion', () => {
    //       // KeyDown
    //       input.simulate('keydown', {
    //         preventDefault: jest.fn(),
    //         keyCode: 40,
    //       });

    //       const activeSuggestionClass = cx('active-suggestion');
    //       const elements = getSuggestionsElements();

    //       expect(elements.exists(`.${activeSuggestionClass}`)).toBeTruthy();
    //       expect(elements.first().hasClass(activeSuggestionClass)).toBeTruthy();

    //       // KeyUp
    //       input.simulate('keydown', { preventDefault: jest.fn(), keyCode: 38 });
    //       const updatedElements = getSuggestionsElements();

    //       expect(
    //         updatedElements.exists(`.${activeSuggestionClass}`)
    //       ).toBeFalsy();
    //     });

    //     it('should hide suggestions on esc key pressed', () => {
    //       expect(wrapper.exists(`.${cx('suggestion-list')}`)).toBeTruthy();

    //       input.simulate('keydown', {
    //         preventDefault: jest.fn(),
    //         keyCode: 27,
    //       });

    //       expect(wrapper.exists(`.${cx('suggestion-list')}`)).toBeFalsy();
    //     });
    //   });
    //   it('should select suggestion when enter key pressed on active suggestion', () => {
    //     let inputRef;
    //     const onSuggestionSelected = jest.fn();
    //     const wrapper = mount(
    //       <AutoComplete
    //         refine={() => null}
    //         searchForSuggestions={() => null}
    //         suggestions={mockSuggestions}
    //         onSuggestionSelected={onSuggestionSelected}
    //         __inputRef={node => {
    //           inputRef = node;
    //         }}
    //       />
    //     );

    //     inputRef.blur = jest.fn();

    //     const firstSuggestionOption = mockSuggestions[0].suggestion;
    //     const input = wrapper.find('input');

    //     input.simulate('focus');
    //     input.simulate('change', {
    //       target: { value: suggestionCompliantChar },
    //     });

    //     input.simulate('keydown', { preventDefault: jest.fn(), keyCode: 40 });
    //     input.simulate('keydown', { preventDefault: jest.fn(), keyCode: 13 });

    //     expect(onSuggestionSelected).toHaveBeenCalled();
    //     expect(inputRef.value).toEqual(firstSuggestionOption);
    //   });
    //   it('lets you give custom components for suggestion via renderProps', () => {
    //     const renderCustomSuggestion = suggestion => <h1>{suggestion}</h1>;

    //     const wrapper = shallow(
    //       <AutoComplete
    //         refine={() => null}
    //         searchForSuggestions={() => null}
    //         suggestions={mockSuggestions}
    //         renderSuggestion={renderCustomSuggestion}
    //       />
    //     ).dive();

    //     const input = wrapper.find('input');
    //     input.simulate('focus');
    //     input.simulate('change', {
    //       target: { value: suggestionCompliantChar },
    //     });

    //     mockSuggestions.forEach(suggestion => {
    //       expect(
    //         wrapper.contains(renderCustomSuggestion(suggestion))
    //       ).toBeTruthy();
    //     });
    //   });
    //   it('should refine search on suggestion selected', () => {
    //     const refine = jest.fn();
    //     const wrapper = shallow(
    //       <AutoComplete
    //         refine={refine}
    //         searchForSuggestions={() => null}
    //         suggestions={mockSuggestions}
    //       />
    //     ).dive();

    //     const input = wrapper.find('input');
    //     input.simulate('focus');
    //     input.simulate('change', {
    //       target: { value: suggestionCompliantChar },
    //     });

    //     wrapper
    //       .find(`.${cx('suggestion-list')}`)
    //       .children()
    //       .first()
    //       .simulate('mousedown');

    //     expect(refine).toHaveBeenCalled();
    //   });

    //   it('should refine search on submit', () => {
    //     const refine = jest.fn();
    //     let inputRef;
    //     const wrapper = mount(
    //       <AutoComplete
    //         refine={refine}
    //         searchForSuggestions={() => null}
    //         suggestions={mockSuggestions}
    //         __inputRef={node => {
    //           inputRef = node;
    //         }}
    //       />
    //     );

    //     inputRef.blur = jest.fn();

    //     wrapper.find('input').simulate('change', {
    //       target: { value: suggestionCompliantChar },
    //     });

    //     wrapper.find('form').simulate('submit', {
    //       preventDefault: jest.fn(),
    //       stopPropagation: jest.fn(),
    //     });

    //     expect(refine).toHaveBeenCalled();
    //   });
    //   it('should trigger submit when triggerSubmitOnSuggestionSelected prop is true', () => {
    //     const onSubmit = jest.fn();
    //     const wrapper = mount(
    //       <AutoComplete
    //         refine={() => null}
    //         searchForSuggestions={() => null}
    //         suggestions={mockSuggestions}
    //         onSubmit={onSubmit}
    //         triggerSubmitOnSuggestionSelected
    //       />
    //     );

    //     const input = wrapper.find('input');
    //     input.simulate('focus');
    //     input.simulate('change', {
    //       target: { value: suggestionCompliantChar },
    //     });

    //     wrapper
    //       .find(`.${cx('suggestion-list')}`)
    //       .children()
    //       .first()
    //       .simulate('mousedown');

    //     expect(onSubmit).toHaveBeenCalled();
    //   });
    //   it('should update suggestions onChange', () => {
    //     const searchForSuggestions = jest.fn();
    //     const wrapper = shallow(
    //       <AutoComplete
    //         searchForSuggestions={searchForSuggestions}
    //         refine={() => null}
    //         suggestions={mockSuggestions}
    //       />
    //     ).dive();

    //     wrapper.find('input').simulate('change', {
    //       target: { value: suggestionCompliantChar },
    //     });

    //     expect(searchForSuggestions).toHaveBeenCalled();
    //   });
    // });
  });
});
