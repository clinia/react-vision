import React, { Component } from 'react';
import LoadingIndicator from './LoadingIndicator';
import { createClassNames } from '../core/utils';
import classnames from 'classnames';
import { translatable } from 'react-vision-core';

type Props = {
  currentRefinement?: string;
  searchAsYouType?: boolean;
  className?: string;
  placeholder?: string;
  style?: React.CSSProperties;

  autoFocus?: boolean;
  loading?: boolean;
  showLoadingIndicator?: boolean;
  disabled?: boolean;

  onClear?: (event?: any) => void;
  onFocus?: (event?: React.FocusEvent) => void;
  onBlur?: (event?: React.FocusEvent) => void;
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  onChange?: (event?: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (event?: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit?: (event: any) => void;

  clearButton?: (clearSearch: () => void) => React.ReactNode;
  submitButton?: React.ReactNode;
  loadingIndicator?: React.ReactNode;
  translate: any;
};

type State = {
  query: string;
  data: any[];
};

const cx = createClassNames('SearchBox');

const mockData = [
  { id: '1', name: 'Clinic 1' },
  { id: '2', name: 'Clinic 2' },
  { id: '3', name: 'Clinic 3' },
  { id: '4', name: 'Clinic 4' },
  { id: '5', name: 'Clinic 5' },
  { id: '6', name: 'Clinic 6' },
  { id: '7', name: 'Clinic 7' },
  { id: '8', name: 'Clinic 8' },
  { id: '9', name: 'Clinic 9' },
  { id: '10', name: 'Clinic 10' },
];

class SearchBox extends Component<Props, State> {
  formRef;
  state = {
    query: '',
    data: [],
  };

  constructor(props) {
    super(props);
    // We bind functions for test purposes instead of using arrow functions
    this.onSubmit = this.onSubmit.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onClear = this.onClear.bind(this);
    this.formRef = React.createRef();
  }

  onSubmit(event) {
    event.preventDefault();
    const { query } = this.state;

    const fetchedData = mockData.filter(data =>
      data.name.toLowerCase().includes(query.toLowerCase())
    );

    this.setState({ data: fetchedData });

    if (this.props.onSubmit) this.props.onSubmit(event);
  }

  onInput(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    const { searchAsYouType } = this.props;

    this.setState({ query }, () => {
      if (searchAsYouType) {
        this.formRef.dispatchEvent(new Event('submit'));
      }
    });

    if (this.props.onInput) this.props.onInput(event);
  }

  onClear() {
    const query = '';
    this.setState({ query });
  }

  render() {
    const {
      autoFocus,
      className,
      clearButton,
      disabled,
      loading,
      loadingIndicator,
      showLoadingIndicator,
      onBlur,
      onChange,
      onClear,
      onFocus,
      onKeyPress,
      placeholder,
      style,
      submitButton,
      translate,
    } = this.props;

    const { query } = this.state;

    return (
      <div className={classnames(cx(''), className)} style={style}>
        <form onSubmit={this.onSubmit} ref={ref => (this.formRef = ref)}>
          <div style={{ display: 'flex' }}>
            <input
              id="search-box-input"
              type="search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              disabled={disabled}
              spellCheck={false}
              className={cx('input')}
              onInput={this.onInput}
              onChange={onChange}
              onKeyPress={onKeyPress}
              onBlur={onBlur}
              autoFocus={autoFocus}
              onFocus={onFocus}
              value={query}
              placeholder={
                placeholder ? placeholder : translatable('placeholder')
              }
            />
            {showLoadingIndicator &&
              loading &&
              (loadingIndicator ? (
                loadingIndicator
              ) : (
                <LoadingIndicator isLoading={loading} />
              ))}
            {clearButton ? (
              clearButton(this.onClear)
            ) : (
              <button
                id="search-box-clear"
                className={cx('clear')}
                onClick={onClear ? onClear : this.onClear}
              >
                {translate('clearText')}
              </button>
            )}
            {submitButton ? (
              submitButton
            ) : (
              <button className={cx('submit')} type="submit">
                {translate('searchText')}
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default translatable({
  placeholder: 'Default',
  searchText: 'Search',
  clearText: 'Clear',
})(SearchBox);
