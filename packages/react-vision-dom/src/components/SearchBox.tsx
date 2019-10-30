import React, { Component } from 'react';
import LoadingIndicator from './LoadingIndicator';

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
  isLoading: boolean;
};

class SearchBox extends Component<Props, State> {
  state = {
    query: '',
    isLoading: false,
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

    const { isLoading: internalStateLoading } = this.state;

    //If loading is not controlled by the user, uses the internal state loading
    const isSearchLoading = !loading ? internalStateLoading : loading;

    return (
      <div className={className} style={style}>
        <form onSubmit={onSubmit ? onSubmit : this.onSubmit}>
          <div>
            <div className="search-box-input">
              <input
                id="search-box-input"
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
                <LoadingIndicator isLoading={isSearchLoading} />
              )}
              {clearButton ? (
                clearButton
              ) : (
                <span
                  className="clearSearch"
                  onClick={onClear ? onClear : this.onClear}
                />
              )}
            </div>
            {submitButton ? (
              submitButton
            ) : (
              <button className="search-box-button" type="submit" />
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default SearchBox;
