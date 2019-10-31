import React from 'react';
import classnames from 'classnames';

type Props = {
  isLoading?: boolean;
};

const LoadingIndicator: React.FunctionComponent<Props> = ({ isLoading }) => {
  return (
    <div>
      <span className={classnames({ loading: isLoading })} />
    </div>
  );
};

export default LoadingIndicator;
