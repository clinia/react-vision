import React, { Component } from 'react';

type Props = {
  currentRefinement?: string;
  searchAsYouType?: boolean;
  className?: string;
  style?: React.CSSProperties;

  autoFocus?: boolean;

  onSearch?: (event: any) => void;
  onClear?: (event: any) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;

  clearButton?: React.ReactNode;
  submitButton?: React.ReactNode;
  loadingIndicator?: React.ReactNode;
};

type State = {
  query: string;
};

class SearchBox extends Component<Props, State> {
  state = {
    query: '',
  };

  onSubmit = () => {
    const { query } = this.state;

    console.log(query);
  };

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    const { searchAsYouType } = this.props;

    this.setState({ query });

    if (searchAsYouType) {
      this.onSubmit();
    }
  };

  render() {
    const {
      className,
      onSubmit,
      onChange,
      onKeyPress,
      onBlur,
      autoFocus,
    } = this.props;

    return (
      <div className={className}>
        <form onSubmit={onSubmit ? onSubmit : this.onSubmit}>
          <input
            onChange={onChange ? onChange : this.onChange}
            onKeyPress={onKeyPress}
            onBlur={onBlur}
            autoFocus={autoFocus}
          />
          <button type="submit" />
        </form>
      </div>
    );
  }
}

export default SearchBox;
