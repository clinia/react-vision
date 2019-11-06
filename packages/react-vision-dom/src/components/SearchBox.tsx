import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from './LoadingIndicator';
import { createClassNames } from '../core/utils';
import { translatable } from 'react-vision-core';
import classnames from 'classnames';

const cx = createClassNames('SearchBox');

interface Props {
  currentRefinement?: string;
  className?: string;
  style?: React.CSSProperties;
  refine: Function;
  translate: Function;

  loadingIndicator?: React.ReactNode;
  reset?: React.ReactNode;
  submit?: React.ReactNode;

  focusShortcuts: (string | number)[];

  autoFocus?: boolean;
  loading?: boolean;

  searchAsYouType: boolean;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  onReset?: (event: React.SyntheticEvent) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  isSearchStalled?: boolean;
  showLoadingIndicator?: boolean;

  __inputRef?: Function;
}

interface DefaultProps {}

type PropsWithDefaults = Props & DefaultProps;

type State = {
  query: string;
};

class SearchBox extends Component<Props, State> {
  static propTypes = {
    currentRefinement: PropTypes.string,
    className: PropTypes.string,
    refine: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,

    loadingIndicator: PropTypes.node,
    reset: PropTypes.node,
    submit: PropTypes.node,

    focusShortcuts: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),

    autoFocus: PropTypes.bool,

    searchAsYouType: PropTypes.bool,
    onSubmit: PropTypes.func,
    onReset: PropTypes.func,
    onChange: PropTypes.func,

    isSearchStalled: PropTypes.bool,
    showLoadingIndicator: PropTypes.bool,

    // For testing purposes
    __inputRef: PropTypes.func,
  };

  static defaultProps = {
    currentRefinement: '',
    className: '',
    autoFocus: false,
    searchAsYouType: true,
    showLoadingIndicator: false,
    isSearchStalled: false,
    // loadingIndicator: defaultLoadingIndicator,
    // reset: defaultReset,
    // submit: defaultSubmit,
  };

  constructor(props) {
    super(props);

    this.state = {
      query: props.searchAsYouType ? null : props.currentRefinement,
    };

    // We bind functions for test purposes instead of using arrow functions
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  input!: HTMLInputElement;

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.searchAsYouType &&
      prevProps.currentRefinement !== this.props.currentRefinement
    ) {
      this.setState({
        query: this.props.currentRefinement!,
      });
    }
  }

  getQuery = () =>
    this.props.searchAsYouType
      ? this.props.currentRefinement
      : this.state.query;

  onInputMount = input => {
    this.input = input;
    if (this.props.__inputRef) {
      this.props.__inputRef(input);
    }
  };

  onKeyDown = event => {
    if (!this.props.focusShortcuts) {
      return;
    }

    const shortcuts = this.props.focusShortcuts.map(key =>
      typeof key === 'string' ? key.toUpperCase().charCodeAt(0) : key
    );

    const elt = event.target || event.srcElement;
    const tagName = elt.tagName;
    if (
      elt.isContentEditable ||
      tagName === 'INPUT' ||
      tagName === 'SELECT' ||
      tagName === 'TEXTAREA'
    ) {
      // already in an input
      return;
    }

    const which = event.which || event.keyCode;
    if (shortcuts.indexOf(which) === -1) {
      // not the right shortcut
      return;
    }

    this.input.focus();
    event.stopPropagation();
    event.preventDefault();
  };

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    this.input.blur();

    const { refine, searchAsYouType } = this.props;
    if (!searchAsYouType) {
      refine(this.getQuery());
    }
    return false;
  };

  onChange = event => {
    const { searchAsYouType, refine, onChange } = this.props;
    const value = event.target.value;

    if (searchAsYouType) {
      refine(value);
    } else {
      this.setState({ query: value });
    }

    if (onChange) {
      onChange(event);
    }
  };

  onReset = event => {
    const { searchAsYouType, refine, onReset } = this.props;

    refine('');
    this.input.focus();

    if (!searchAsYouType) {
      this.setState({ query: '' });
    }

    if (onReset) {
      onReset(event);
    }
  };

  render() {
    const {
      className,
      style,
      translate,
      autoFocus,
      loadingIndicator,
      submit,
      reset,
    } = this.props as PropsWithDefaults;
    const query = this.getQuery();

    const searchInputEvents = Object.keys(this.props).reduce((props, prop) => {
      if (
        ['onsubmit', 'onreset', 'onchange'].indexOf(prop.toLowerCase()) ===
          -1 &&
        prop.indexOf('on') === 0
      ) {
        return { ...props, [prop]: this.props[prop] };
      }

      return props;
    }, {});

    const isSearchStalled =
      this.props.showLoadingIndicator! && this.props.isSearchStalled!;

    return (
      <div className={classnames(cx(''), className)} style={style}>
        <form
          noValidate
          onSubmit={this.props.onSubmit ? this.props.onSubmit : this.onSubmit}
          onReset={this.onReset}
          className={cx('form', isSearchStalled && 'form--stalledSearch')}
          action=""
          role="search"
        >
          <input
            ref={this.onInputMount}
            type="search"
            placeholder={translate('placeholder')}
            autoFocus={autoFocus}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            required
            maxLength={512}
            value={query}
            onChange={this.onChange}
            {...searchInputEvents}
            className={cx('input')}
          />
          <button
            type="submit"
            title={translate('submitTitle')}
            className={cx('submit')}
          >
            {submit}
          </button>
          <button
            type="reset"
            title={translate('resetTitle')}
            className={cx('reset')}
            hidden={!query || isSearchStalled}
          >
            {reset}
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
  resetTitle: 'Clear the search query.',
  submitTitle: 'Submit your search query.',
  placeholder: 'Search here…',
})(SearchBox);
