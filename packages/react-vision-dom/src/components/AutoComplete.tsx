import React, { Component } from 'react';
import {
  escapeRegExp,
  createClassNames,
  extractInputEventsFromProps,
} from '../core/utils';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  defaultLoadingIndicator,
  defaultClear,
  defaultSubmit,
} from './defaultComponents';
import { translatable } from 'react-vision-core';

type Suggestion = {
  id: string;
  type: string;
  suggestion: string;
};

interface Props {
  currentRefinement?: string;
  className?: string;
  refine?: (value: string | { lat: number; lng: number } | null) => void;
  searchForSuggestions: (value: string) => void;
  suggestions?: Suggestion[];
  style?: React.CSSProperties;
  translate?: any;

  loadingIndicator?: React.ReactNode;
  clear?: React.ReactNode;
  hideClear?: boolean;
  submit?: React.ReactNode;
  renderSuggestion?: (suggestion: Suggestion) => React.ReactNode;
  suggestionValue?: (suggestion: Suggestion) => string;

  autoFocus?: boolean;
  triggerSubmitOnSuggestionSelected?: boolean;

  onSubmit?: (event: any) => void;
  onClear?: (event: any) => void;
  onSuggestionSelected?: (suggestion: Suggestion) => void;
  onBlur(event: React.FocusEvent<HTMLInputElement>);
  onFocus(event: React.FocusEvent<HTMLInputElement>);
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onUserPositionError?: () => void;

  isSearchStalled: boolean;
  showLoadingIndicator?: boolean;
  disabled?: boolean;

  customThemeKey: string;
  __inputRef: (el: any) => void;
}

interface DefaultProps {
  currentRefinement: string;
  suggestions: Suggestion[];
  className: string;
  searchForSuggestions: (value: string) => void;
  refine: (value: string | null) => void;
  triggerSubmitOnSuggestionSelected: boolean;
  autoFocus: boolean;
  showLoadingIndicator: boolean;
  isSearchStalled: boolean;
  loadingIndicator: React.ReactNode;
  clear: React.ReactNode;
  submit: React.ReactNode;
  renderSuggestion: (suggestion: Suggestion) => React.ReactNode;
}

type PropsWithDefaults = Props & DefaultProps;

type State = {
  query: string;
  queryCache: string;
  showSuggestions: boolean;
  activeSuggestionIndex: number;
  userPosition: { lat: number; lng: number } | null;
};

class AutoComplete extends Component<PropsWithDefaults, State> {
  input!: HTMLInputElement;
  formRef: any = React.createRef();
  cx = createClassNames('autocomplete');

  static propTypes = {
    currentRefinement: PropTypes.string,
    className: PropTypes.string,
    refine: PropTypes.func.isRequired,
    searchForSuggestions: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,

    loadingIndicator: PropTypes.node,
    clear: PropTypes.node,
    submit: PropTypes.node,

    autoFocus: PropTypes.bool,

    onSubmit: PropTypes.func,
    onClear: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    onSuggestionSelected: PropTypes.func,

    renderSuggestion: PropTypes.func,
    isSearchStalled: PropTypes.bool,
    showLoadingIndicator: PropTypes.bool,
    disabled: PropTypes.bool,
    __inputRef: PropTypes.func,
  };

  static defaultProps = {
    currentRefinement: '',
    className: '',
    style: {},
    suggestions: [],

    triggerSubmitOnSuggestionSelected: false,
    autoFocus: false,
    isSearchStalled: false,
    showLoadingIndicator: false,
    disabled: false,
  };

  constructor(props: PropsWithDefaults) {
    super(props);

    const initialValue = props.currentRefinement || '';

    this.state = {
      query: initialValue,
      queryCache: initialValue,
      showSuggestions: false,
      activeSuggestionIndex: -1,
      userPosition: null,
    };

    // We bind functions for test purposes instead of using arrow functions
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);

    if (this.props.customThemeKey) {
      this.cx = createClassNames(this.props.customThemeKey);
    }
  }

  onBlur(event: React.FocusEvent<HTMLInputElement>) {
    const { onBlur, searchForSuggestions } = this.props;
    const { query, userPosition } = this.state;

    this.setState({
      showSuggestions: false,
      activeSuggestionIndex: -1,
      queryCache: query,
    });

    if (userPosition) {
      // user position already searched (on selected)
    } else if (query) {
      searchForSuggestions(query);
    }

    if (onBlur) {
      onBlur(event);
    }
  }

  onFocus(event: React.FocusEvent<HTMLInputElement>) {
    const { onFocus } = this.props;

    this.setState({ showSuggestions: true, activeSuggestionIndex: -1 });

    if (onFocus) {
      onFocus(event);
    }
  }

  moveActiveSuggestionDown = () => {
    const newActiveSuggestionIndex = this.state.activeSuggestionIndex + 1;
    const query = this.getSuggestionNameByIndex(newActiveSuggestionIndex);

    this.setState({
      activeSuggestionIndex: newActiveSuggestionIndex,
      query,
    });
  };

  moveActiveSuggestionUp = () => {
    const newActiveSuggestionIndex = this.state.activeSuggestionIndex - 1;
    const query = this.getSuggestionNameByIndex(newActiveSuggestionIndex);

    this.setState({
      activeSuggestionIndex: newActiveSuggestionIndex,
      query,
    });
  };

  moveActiveSuggestionToTheTop = () => {
    const { queryCache } = this.state;

    this.setState({ activeSuggestionIndex: -1, query: queryCache });
  };

  moveActiveSuggestionToTheLast = () => {
    const lastSuggestionIndex = this.props.suggestions.length - 1;
    const query = this.getSuggestionNameByIndex(lastSuggestionIndex);

    this.setState({
      activeSuggestionIndex: lastSuggestionIndex,
      query,
    });
  };

  getSuggestionNameByIndex = (index: number) => {
    const { translate } = this.props;

    if (index >= 0 && this.props.suggestions[index]) {
      const suggestion = this.props.suggestions[index];
      if (suggestion.type === 'user') {
        return translate('userPosition');
      } else {
        return suggestion.suggestion;
      }
    } else return '';
  };

  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { onKeyDown, suggestions } = this.props;
    const { activeSuggestionIndex, showSuggestions } = this.state;

    if (showSuggestions) {
      // Up arrow key
      if (event.keyCode === 38) {
        if (activeSuggestionIndex > 0) {
          this.moveActiveSuggestionUp();
        } else if (activeSuggestionIndex === 0) {
          this.moveActiveSuggestionToTheTop();
        } else if (activeSuggestionIndex === -1) {
          this.moveActiveSuggestionToTheLast();
        }
        event.preventDefault();
      }

      // Down arrow key
      else if (event.keyCode === 40) {
        if (activeSuggestionIndex + 1 === suggestions.length) {
          this.moveActiveSuggestionToTheTop();
        } else {
          this.moveActiveSuggestionDown();
        }
        event.preventDefault();
      }

      // Enter key
      else if (event.keyCode === 13) {
        if (activeSuggestionIndex === -1) this.search();
        else this.onSuggestionSelected(suggestions[activeSuggestionIndex]);
      }

      // Esc Key
      if (event.keyCode === 27) {
        event.preventDefault();
        this.setState({ showSuggestions: false });
      }
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  }

  onSuggestionSelected(suggestion: Suggestion) {
    const {
      translate,
      onSuggestionSelected,
      triggerSubmitOnSuggestionSelected,
      onUserPositionError,
      suggestionValue,
    } = this.props;

    const { type } = suggestion;
    let { suggestion: value } = suggestion;

    // Override value if function is implemented
    if (suggestionValue) {
      value = suggestionValue(suggestion);
    }

    if (type === 'user') {
      // try to get user position
      try {
        navigator.geolocation.getCurrentPosition(
          position => {
            const {
              coords: { latitude, longitude },
            } = position;

            this.setState(
              {
                query: translate('userPosition'),
                queryCache: translate('userPosition'),
                activeSuggestionIndex: -1,
                userPosition: { lat: latitude, lng: longitude },
              },
              () => {
                this.search();
                if (triggerSubmitOnSuggestionSelected) {
                  this.formRef.dispatchEvent(new Event('submit'));
                }
              }
            );
          },
          () => {
            // Error while fetching user position
            if (onUserPositionError) {
              onUserPositionError();
            }
          }
        );
      } catch (e) {
        // Exception while fetching user position
        if (onUserPositionError) {
          onUserPositionError();
        }
      }
    } else {
      this.setState(
        {
          query: value,
          queryCache: value,
          activeSuggestionIndex: -1,
          userPosition: null,
        },
        () => {
          this.search();
          if (triggerSubmitOnSuggestionSelected) {
            this.formRef.dispatchEvent(new Event('submit'));
          }
        }
      );
    }

    if (onSuggestionSelected) {
      onSuggestionSelected(suggestion);
    }
  }

  search() {
    const { query, userPosition } = this.state;
    const { refine } = this.props;

    if (userPosition) {
      refine({ ...userPosition });
    } else if (query) {
      refine(query);
    }
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { searchForSuggestions, onChange } = this.props;
    let { userPosition } = this.state;
    let query = event.target.value;

    // If user position was selected besore, clear it to start the search anew
    if (userPosition) {
      query = '';
      userPosition = null;
    }

    this.setState({
      query,
      queryCache: query,
      activeSuggestionIndex: -1,
      showSuggestions: true,
      userPosition,
    });

    if (query) {
      searchForSuggestions(query);
    } else {
      this.setState({ showSuggestions: false });
    }

    if (onChange) {
      onChange(event);
    }
  }

  onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    this.input.blur();
    this.search();
  }

  onClear(event: React.FormEvent<HTMLFormElement>) {
    const { refine, onClear } = this.props;

    this.setState({
      query: '',
      queryCache: '',
      activeSuggestionIndex: -1,
      showSuggestions: false,
      userPosition: null,
    });
    refine('');

    if (onClear) {
      onClear(event);
    }
  }

  renderSuggestion = suggestion => {
    const { query } = this.state;

    // Render user suggestion (Location only)
    if (suggestion.type === 'user') {
      const { translate } = this.props;
      return <div>{translate('userPosition')}</div>;
    }

    const highlightedSuggestion = suggestion.suggestion.replace(
      new RegExp(escapeRegExp(query), 'gi'),
      match => {
        return `<strong>${match}</strong>`;
      }
    );

    return <div dangerouslySetInnerHTML={{ __html: highlightedSuggestion }} />;
  };

  onInputMount = input => {
    this.input = input;
    if (this.props.__inputRef) {
      this.props.__inputRef(input);
    }
  };

  render() {
    const {
      suggestions,
      translate,
      className,
      style,
      isSearchStalled,
      submit,
      clear,
      hideClear,
      loadingIndicator,
      autoFocus,
      disabled,
      renderSuggestion,
      showLoadingIndicator,
    } = this.props;

    const {
      query,
      showSuggestions,
      activeSuggestionIndex: activeSuggestion,
    } = this.state;

    // Events that cannot be completely overridden due to internal use
    const internalEvents = [
      'onkeydown',
      'onsubmit',
      'onclear',
      'onchange',
      'onblur',
      'onfocus',
      'onsuggestionselected',
    ];

    const autoCompleteInputEvents = extractInputEventsFromProps(
      internalEvents,
      this.props
    );

    return (
      <div className={classnames(this.cx(''), className)} style={style}>
        <form
          noValidate
          onSubmit={this.props.onSubmit ? this.props.onSubmit : this.onSubmit}
          onReset={this.onClear}
          className={this.cx(
            'form',
            isSearchStalled ? 'form--stalledSearch' : ''
          )}
          action=""
          role="search"
          ref={ref => {
            this.formRef = ref;
          }}
        >
          <div className={this.cx('autocomplete')}>
            <input
              ref={this.onInputMount}
              type="search"
              placeholder={translate('placeholder')}
              autoFocus={autoFocus}
              disabled={disabled}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              required
              maxLength={512}
              value={query!}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              onKeyDown={this.onKeyDown}
              {...autoCompleteInputEvents}
              className={this.cx('input')}
            />
            {showSuggestions && (
              <ul className={this.cx('suggestion-list')}>
                {suggestions.map((suggestion, index) => (
                  <li
                    className={classnames(this.cx('suggestion'), {
                      [`${this.cx('active-suggestion')}`]:
                        index === activeSuggestion,
                    })}
                    key={suggestion.suggestion}
                    style={
                      index === activeSuggestion
                        ? { backgroundColor: '#f5f5f8' }
                        : {}
                    }
                    onMouseDown={() => this.onSuggestionSelected(suggestion)}
                  >
                    {renderSuggestion
                      ? renderSuggestion(suggestion)
                      : this.renderSuggestion(suggestion)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            className={this.cx('submit')}
            title={translate('searchTitle')}
          >
            {submit || defaultSubmit(this.cx)}
          </button>
          <button
            type="reset"
            title={translate('clearTitle')}
            className={this.cx('clear')}
            hidden={!query || isSearchStalled}
          >
            {!hideClear ? clear || defaultClear(this.cx) : null}
          </button>
          {showLoadingIndicator && (
            <span
              hidden={!isSearchStalled}
              className={this.cx('loadingindicator')}
            >
              {loadingIndicator || defaultLoadingIndicator(this.cx)}
            </span>
          )}
        </form>
      </div>
    );
  }
}

export default translatable({
  placeholder: 'Search',
  searchTitle: 'Search',
  clearTitle: 'Clear',
  userPosition: 'Current position',
})(AutoComplete);
