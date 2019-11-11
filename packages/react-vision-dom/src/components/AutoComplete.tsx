import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import { escapeRegExp, createClassNames } from '../core/utils';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import LoadingIndicator from './LoadingIndicator';

type Suggestion = {
  id: string;
  name: string;
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

  autoFocus?: boolean;

  onSubmit?: (event: any) => void;
  onClear?: (event: any) => void;
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
}

type PropsWithDefaults = Props & DefaultProps;

type State = {
  query: string;
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

    isSearchStalled: PropTypes.bool,
    showLoadingIndicator: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    currentRefinement: '',
    className: '',
    style: {},

    loadingIndicator: <LoadingIndicator />,
    //TODO
    // clear?: React.ReactNode;
    // submit?: React.ReactNode;

    autoFocus: false,
    isSearchStalled: false,
    showLoadingIndicator: false,
    disabled: false,
  };

  constructor(props: PropsWithDefaults) {
    super(props);
    this.state = {
      query: '',
    };

    // We bind functions for test purposes instead of using arrow functions
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>, { newValue }) {
    const { refine, onChange } = this.props;

    this.setState({
      query: newValue,
    });

    refine(newValue);

    if (onChange) {
      onChange(event);
    }
  }

  onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    this.input.blur();
  }

  onClear() {}

  onSuggestionsFetchRequested = async ({ value }) => {
    this.props.searchForSuggestions(value);
  };

  renderSuggestion = suggestion => {
    const { query: value } = this.state;

    const highlightedSuggestion = suggestion.name.replace(
      new RegExp(escapeRegExp(value), 'gi'),
      match => {
        return `<strong>${match}</strong>`;
      }
    );

    return <div dangerouslySetInnerHTML={{ __html: highlightedSuggestion }} />;
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
    } = this.props;

    const { query } = this.state;

    const inputProps = {
      placeholder: translate('searchText'),
      value: query,
      onChange: this.onChange,
      className: cx('input'),
      type: 'search',
      autoComplete: 'off',
      autoCorrect: 'off',
      autoCapitalize: 'off',
      spellCheck: false,
      required: true,
      maxLength: 512,
    };

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
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            getSuggestionValue={suggestion => suggestion.name}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
          />
          <button type="submit" title={translate('search')}>
            {submit}
          </button>
          <button
            type="reset"
            title={translate('clearText')}
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

export default AutoComplete;
