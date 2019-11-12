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
  suggestion: string;
};

interface Props {
  currentRefinement?: string;
  className?: string;
  refine?: (value: string | null) => void;
  searchForSuggestions: (value: string) => void;
  suggestions?: Array<Suggestion>;
  style?: React.CSSProperties;
  translate?: any;

  loadingIndicator?: React.ReactNode;
  clear?: React.ReactNode;
  submit?: React.ReactNode;
  renderSuggestion?: (suggestion: Suggestion) => React.ReactNode;

  autoFocus?: boolean;

  onSubmit?: (event: any) => void;
  onClear?: (event: any) => void;
  onSuggestionSelected?: (suggestion: Suggestion) => void;
  onBlur(event: React.FocusEvent<HTMLInputElement>);
  onFocus(event: React.FocusEvent<HTMLInputElement>);
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  isSearchStalled: boolean;
  showLoadingIndicator?: boolean;
  disabled?: boolean;
}

interface DefaultProps {
  currentRefinement: string;
  suggestions: Array<Suggestion>;
  className: string;
  searchForSuggestions: (value: string) => void;
  refine: (value: string | null) => void;
  autoFocus: boolean;
  showLoadingIndicator: boolean;
  isSearchStalled: boolean;
  loadingIndicator: React.ReactNode;
  clear: React.ReactNode;
  submit: React.ReactNode;
  renderSuggestion: (suggestion: Suggestion) => React.ReactNode;
  __inputRef: (el: any) => void;
}

type PropsWithDefaults = Props & DefaultProps;

type State = {
  query: string;
  queryCache: string;
  showSuggestions: boolean;
  activeSuggestionIndex: number;
};

const cx = createClassNames('AutoComplete');

class AutoComplete extends Component<PropsWithDefaults, State> {
  input!: HTMLInputElement;

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

    loadingIndicator: defaultLoadingIndicator(cx),
    clear: defaultClear(cx),
    submit: defaultSubmit(cx),

    autoFocus: false,
    isSearchStalled: false,
    showLoadingIndicator: false,
    disabled: false,
  };

  constructor(props: PropsWithDefaults) {
    super(props);
    this.state = {
      query: '',
      queryCache: '',
      showSuggestions: false,
      activeSuggestionIndex: -1,
    };

    // We bind functions for test purposes instead of using arrow functions
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  onBlur(event: React.FocusEvent<HTMLInputElement>) {
    const { onBlur, searchForSuggestions } = this.props;
    const { query } = this.state;

    this.setState({
      showSuggestions: false,
      activeSuggestionIndex: -1,
      queryCache: query,
    });

    searchForSuggestions(query);

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
    if (index >= 0 && this.props.suggestions[index]) {
      return this.props.suggestions[index].suggestion;
    } else return '';
  };

  onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { onKeyDown, suggestions } = this.props;
    const { activeSuggestionIndex } = this.state;

    //Up arrow key
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

    //Down arrow key
    else if (event.keyCode === 40) {
      if (activeSuggestionIndex + 1 === suggestions.length) {
        this.moveActiveSuggestionToTheTop();
      } else {
        this.moveActiveSuggestionDown();
      }
      event.preventDefault();
    }

    //Enter key
    else if (event.keyCode === 13) {
      this.onSuggestionSelected(suggestions[activeSuggestionIndex]);
      this.input.blur();
    }

    //Esc Key
    if (event.keyCode === 27) {
      event.preventDefault();
      this.setState({ showSuggestions: false });
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  }

  onSuggestionSelected(suggestion: Suggestion) {
    const { onSuggestionSelected, searchForSuggestions, refine } = this.props;

    const query = suggestion.suggestion;
    this.setState({ query, queryCache: query, activeSuggestionIndex: -1 });

    refine(query);
    searchForSuggestions(query);

    if (onSuggestionSelected) {
      onSuggestionSelected(suggestion);
    }
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { searchForSuggestions, onChange } = this.props;
    const query = event.target.value;

    this.setState({ query, queryCache: query, activeSuggestionIndex: -1 });

    searchForSuggestions(query);

    if (onChange) {
      onChange(event);
    }
  }

  onSubmit(event: React.FormEvent<HTMLFormElement>) {
    const { refine, searchForSuggestions } = this.props;
    const { query } = this.state;

    event.preventDefault();
    event.stopPropagation();
    this.input.blur();

    refine(query);
    searchForSuggestions(query);
  }

  onClear(event: React.FormEvent<HTMLFormElement>) {
    const { refine, onClear } = this.props;
    refine('');

    this.setState({ query: '', queryCache: '', activeSuggestionIndex: -1 });
    if (onClear) {
      onClear(event);
    }
  }

  renderSuggestion = suggestion => {
    const { query } = this.state;

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
      loadingIndicator,
      autoFocus,
      disabled,
      renderSuggestion,
    } = this.props;

    const {
      query,
      showSuggestions,
      activeSuggestionIndex: activeSuggestion,
    } = this.state;

    //Events that cannot be completely overridden due to internal use
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
      <div className={classnames(cx(''), className)} style={style}>
        <form
          noValidate
          onSubmit={this.props.onSubmit ? this.props.onSubmit : this.onSubmit}
          onReset={this.onClear}
          className={cx('form', isSearchStalled ? 'form--stalledSearch' : '')}
          action=""
          role="search"
        >
          <div>
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
              className={cx('input')}
            />
            <ul>
              {showSuggestions &&
                suggestions.map((suggestion, index) => (
                  <li
                    key={suggestion.suggestion}
                    style={
                      index === activeSuggestion
                        ? { backgroundColor: 'red' }
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
          </div>
          <button type="submit" title={translate('searchTitle')}>
            {submit}
          </button>
          <button
            type="reset"
            title={translate('clearTitle')}
            className={cx('clear')}
            hidden={!query || isSearchStalled}
          >
            {clear}
          </button>
          {this.props.showLoadingIndicator && (
            <span hidden={!isSearchStalled} className={cx('loadingIndicator')}>
              {loadingIndicator}
            </span>
          )}
        </form>
      </div>
    );
  }
}

export default translatable({
  placeholder: 'Default',
  searchTitle: 'Search',
  clearTitle: 'Clear',
})(AutoComplete);
