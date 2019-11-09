import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createClassNames } from '../core/utils';
import classnames from 'classnames';
import { translatable } from 'react-vision-core';

interface Props {
  currentRefinement?: string;
  className?: string;
  refine?: (value: string | null) => void;
  style?: React.CSSProperties;
  translate?: any;

  loadingIndicator?: React.ReactNode;
  clear?: React.ReactNode;
  submit?: React.ReactNode;

  autoFocus?: boolean;

  focusShortcuts: (string | number)[];

  searchAsYouType?: boolean;
  onSubmit?: (event: any) => void;
  onClear?: (event: any) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  isSearchStalled: boolean;
  showLoadingIndicator?: boolean;
  disabled?: boolean;

  __inputRef: (el: any) => void;
}

interface DefaultProps {
  currentRefinement: string;
  className: string;
  refine: (value: string | null) => void;
  autoFocus: boolean;
  searchAsYouType: boolean;
  showLoadingIndicator: boolean;
  isSearchStalled: boolean;
  loadingIndicator: React.ReactNode;
  clear: React.ReactNode;
  submit: React.ReactNode;
}

type PropsWithDefaults = Props & DefaultProps;

type State = {
  query: string | null;
};

const cx = createClassNames('SearchBox');

const defaultLoadingIndicator = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 38 38"
    xmlns="http://www.w3.org/2000/svg"
    stroke="#444"
    className={cx('loadingIcon')}
  >
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)" strokeWidth="2">
        <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  </svg>
);

const defaultClear = (
  <svg
    className={cx('clearIcon')}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    width="10"
    height="10"
  >
    <path d="M8.114 10L.944 2.83 0 1.885 1.886 0l.943.943L10 8.113l7.17-7.17.944-.943L20 1.886l-.943.943-7.17 7.17 7.17 7.17.943.944L18.114 20l-.943-.943-7.17-7.17-7.17 7.17-.944.943L0 18.114l.943-.943L8.113 10z" />
  </svg>
);

const defaultSubmit = (
  <svg
    className={cx('submitIcon')}
    xmlns="http://www.w3.org/2000/svg"
    width="10"
    height="10"
    viewBox="0 0 40 40"
  >
    <path d="M26.804 29.01c-2.832 2.34-6.465 3.746-10.426 3.746C7.333 32.756 0 25.424 0 16.378 0 7.333 7.333 0 16.378 0c9.046 0 16.378 7.333 16.378 16.378 0 3.96-1.406 7.594-3.746 10.426l10.534 10.534c.607.607.61 1.59-.004 2.202-.61.61-1.597.61-2.202.004L26.804 29.01zm-10.426.627c7.323 0 13.26-5.936 13.26-13.26 0-7.32-5.937-13.257-13.26-13.257C9.056 3.12 3.12 9.056 3.12 16.378c0 7.323 5.936 13.26 13.258 13.26z" />
  </svg>
);

class SearchBox extends Component<PropsWithDefaults, State> {
  input!: HTMLInputElement;

  static propTypes = {
    currentRefinement: PropTypes.string,
    className: PropTypes.string,
    refine: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,

    loadingIndicator: PropTypes.node,
    clear: PropTypes.node,
    submit: PropTypes.node,

    focusShortcuts: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),

    autoFocus: PropTypes.bool,

    searchAsYouType: PropTypes.bool,
    onSubmit: PropTypes.func,
    onClear: PropTypes.func,
    onChange: PropTypes.func,

    isSearchStalled: PropTypes.bool,
    showLoadingIndicator: PropTypes.bool,
    disabled: PropTypes.bool,

    __inputRef: PropTypes.func,
  };

  static defaultProps = {
    currentRefinement: '',
    className: '',
    focusShortcuts: ['s', '/'],
    autoFocus: false,
    searchAsYouType: true,
    showLoadingIndicator: false,
    isSearchStalled: false,
    loadingIndicator: defaultLoadingIndicator,
    clear: defaultClear,
    submit: defaultSubmit,
  };

  constructor(props: PropsWithDefaults) {
    super(props);

    this.state = {
      query: props.searchAsYouType ? null : props.currentRefinement,
    };

    // We bind functions for test purposes instead of using arrow functions
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate(prevProps: PropsWithDefaults) {
    if (
      !this.props.searchAsYouType &&
      prevProps.currentRefinement !== this.props.currentRefinement
    ) {
      this.setState({
        query: this.props.currentRefinement,
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

  onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    this.input.blur();

    const { refine, searchAsYouType } = this.props;
    if (!searchAsYouType) {
      refine(this.getQuery());
    }
    return false;
  }

  onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { searchAsYouType, refine, onChange } = this.props;
    const query = event.target.value;

    if (searchAsYouType) {
      refine(query);
    } else {
      this.setState({ query });
    }

    if (onChange) {
      onChange(event);
    }
  }

  onClear(event: React.FormEvent<HTMLFormElement>) {
    const { searchAsYouType, refine, onClear } = this.props;

    refine('');
    this.input.focus();

    if (!searchAsYouType) {
      this.setState({ query: '' });
    }

    if (onClear) {
      onClear(event);
    }
  }

  render() {
    const {
      className,
      style,
      translate,
      autoFocus,
      loadingIndicator,
      submit,
      clear,
      disabled,
    } = this.props;
    const query = this.getQuery();

    // This enbale the developer to provide any on* events for the input
    // exececpt the ones we uses internally
    const searchInputEvents = Object.keys(this.props).reduce((props, prop) => {
      if (
        ['onsubmit', 'onclear', 'onchange'].indexOf(prop.toLowerCase()) ===
          -1 &&
        prop.indexOf('on') === 0
      ) {
        return { ...props, [prop]: this.props[prop] };
      }

      return props;
    }, {});

    const isSearchStalled =
      this.props.showLoadingIndicator && this.props.isSearchStalled;

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
            {...searchInputEvents}
            className={cx('input')}
          />
          <button
            type="submit"
            title={translate('searchTitle')}
            className={cx('submit')}
          >
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
})(SearchBox);
