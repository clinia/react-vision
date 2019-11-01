import React, { Component } from 'react';
import LoadingIndicator from './LoadingIndicator';
import { createClassNames } from '../core/utils';
import classnames from 'classnames';

type Props = {
  currentRefinement?: string;
  searchAsYouType?: boolean;
  className?: string;
  style?: React.CSSProperties;

  autoFocus?: boolean;
  loading?: boolean;

  onClear?: (event: any) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;

  clearButton?: React.ReactNode;
  submitButton?: React.ReactNode;
  loadingIndicator?: React.ReactNode;
};

type State = {
  query: string;
};

const cx = createClassNames('SearchBox');

class SearchBox extends Component<Props, State> {
  state = {
    query: '',
  };

  constructor(props) {
    super(props);
    // We bind functions for test purposes instead of using arrow functions
    this.onSubmit = this.onSubmit.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  onSubmit() {
    const { query } = this.state;

    console.log(query);
  }

  onInput(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    const { searchAsYouType } = this.props;

    this.setState({ query });

    if (searchAsYouType) {
      this.onSubmit();
    }
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
      loading,
      loadingIndicator,
      onBlur,
      onChange,
      onClear,
      onFocus,
      onInput,
      onKeyPress,
      onSubmit,
      style,
      submitButton,
    } = this.props;

    return (
      <div className={classnames(cx(''), className)} style={style}>
        <form onSubmit={onSubmit ? onSubmit : this.onSubmit}>
          <div>
            <input
              id="search-box-input"
              type="search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className={cx('input')}
              onInput={onInput ? onInput : this.onInput}
              onChange={onChange}
              onKeyPress={onKeyPress}
              onBlur={onBlur}
              autoFocus={autoFocus}
              onFocus={onFocus}
            />
            {loadingIndicator ? (
              loadingIndicator
            ) : (
              <LoadingIndicator isLoading={loading} />
            )}
            {clearButton ? (
              clearButton
            ) : (
              <span
                id="search-box-clear"
                className={cx('clear')}
                onClick={onClear ? onClear : this.onClear}
              />
            )}
            {submitButton ? (
              submitButton
            ) : (
              <button className={cx('submit')} type="submit" />
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default SearchBox;
