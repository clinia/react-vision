import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createClassNames, extractInputEventsFromProps } from '../core/utils';
import classnames from 'classnames';
import { translatable } from 'react-vision-core';
import {
  defaultLoadingIndicator,
  defaultClear,
  defaultSubmit,
} from './defaultComponents';

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

  focusShortcuts: Array<string | number>;

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

const cx = createClassNames('searchbox');

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
    loadingIndicator: defaultLoadingIndicator(cx),
    clear: defaultClear(cx),
    submit: defaultSubmit(cx),
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

    // Events that cannot be completely overridden due to internal use
    const internalEvents = ['onsubmit', 'onclear', 'onchange'];
    const searchInputEvents = extractInputEventsFromProps(
      internalEvents,
      this.props
    );

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
            <span hidden={!isSearchStalled} className={cx('loadingindicator')}>
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
