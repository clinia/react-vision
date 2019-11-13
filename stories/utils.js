import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { linkTo } from '@storybook/addon-links';
import cliniasearch from 'cliniasearch/lite';
import { Vision, SearchBox, connectHits } from 'react-vision-dom';

export const WrapWithHits = ({
  searchParameters: askedSearchParameters = {},
  children,
  searchBox = true,
  hasPlayground = false,
  linkedStoryGroup,
  pagination = true,
  appId,
  apiKey,
  indexName,
  hitsElement,
  initialSearchState,
  onSearchStateChange,
}) => {
  const searchClient = useMemo(() => {
    return cliniasearch(appId, apiKey, {
      hosts: {
        write: ['api.partner.staging.clinia.ca'],
        read: ['api.partner.staging.clinia.ca'],
      },
    });
  }, [appId, apiKey]);

  // const hits = hitsElement || <CustomHits />;

  const searchParameters = {
    perPage: 3,
    ...askedSearchParameters,
  };

  const [searchState, setSearchState] = useState(initialSearchState);

  const setNextSearchState = nextSearchState => {
    setSearchState(nextSearchState);
    onSearchStateChange(nextSearchState);
  };

  return (
    <Vision
      searchClient={searchClient}
      indexName={indexName}
      searchState={searchState}
      onSearchStateChange={setNextSearchState}
    >
      <div>
        <div className="container widget-container">{children}</div>
        <div>{searchBox ? <></> : null}</div>
      </div>
    </Vision>
  );
};

WrapWithHits.propTypes = {
  appId: PropTypes.string,
  apiKey: PropTypes.string,
  indexName: PropTypes.string,
  children: PropTypes.node,
  searchBox: PropTypes.bool,
  linkedStoryGroup: PropTypes.string,
  hasPlayground: PropTypes.bool,
  pagination: PropTypes.bool,
  searchParameters: PropTypes.object,
  hitsElement: PropTypes.element,
  initialSearchState: PropTypes.object,
  onSearchStateChange: PropTypes.func,
};

WrapWithHits.defaultProps = {
  appId: 'TODO',
  apiKey: 'ClM5vDTmS4GWEL0aS7osJaRkowV8McuP',
  indexName: 'health_facility',
  initialSearchState: {},
  onSearchStateChange: () => {},
};
