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
  isInputFocused: boolean;
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
      isInputFocused: false,
    };

    // We bind functions for test purposes instead of using arrow functions
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  onBlur(event: React.FocusEvent<HTMLInputElement>) {
    const { onBlur } = this.props;

    this.setState({ isInputFocused: false });

    if (onBlur) {
      onBlur(event);
    }
  }

  onFocus(event: React.FocusEvent<HTMLInputElement>) {
    const { onFocus } = this.props;

    this.setState({ isInputFocused: true });

    if (onFocus) {
      onFocus(event);
    }
  }

  onSuggestionSelected(suggestion: Suggestion) {
    const { onSuggestionSelected } = this.props;

    console.log(suggestion);

    this.setState({ query: suggestion.suggestion });

    if (onSuggestionSelected) {
      onSuggestionSelected(suggestion);
    }
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { searchForSuggestions, onChange } = this.props;
    const query = event.target.value;

    this.setState({ query });

    searchForSuggestions(query);

    if (onChange) {
      onChange(event);
    }
  }

  onSubmit(event: React.FormEvent<HTMLFormElement>) {
    const { refine, currentRefinement } = this.props;

    event.preventDefault();
    event.stopPropagation();
    this.input.blur();

    refine(currentRefinement);
  }

  onClear(event: React.FormEvent<HTMLFormElement>) {
    const { refine, onClear } = this.props;
    refine('');

    this.setState({ query: '' });
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

    const { query, isInputFocused } = this.state;

    //Events that cannot be completely overridden due to internal use
    const internalEvents = [
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
              {...autoCompleteInputEvents}
              className={cx('input')}
            />
            <ul>
              {isInputFocused &&
                suggestions.map(suggestion => (
                  <li
                    key={suggestion.suggestion}
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
