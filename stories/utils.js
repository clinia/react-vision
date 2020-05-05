import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { linkTo } from '@storybook/addon-links';
import clinia from 'clinia/lite';
import {
  Vizion,
  Configure,
  SearchBox,
  connectHits,
} from '@clinia/react-vizion-dom';
import './style.css';

const Hits = ({ hits }) => (
  <div className="hits">
    {hits.map(hit => (
      <div key={hit.id} className="hit">
        <div className="hit-content">
          <div>
            <h4>{hit.name}</h4>
          </div>
        </div>
      </div>
    ))}
  </div>
);

Hits.propTypes = {
  hits: PropTypes.array.isRequired,
};

export const CustomHits = connectHits(Hits);

export const WrapWithHits = ({
  searchParameters: askedSearchParameters = {},
  children,
  searchBox = true,
  hasPlayground = false,
  linkedStoryGroup,
  // pagination = true,
  appId,
  apiKey,
  indexName,
  hitsElement,
  initialSearchState,
  onSearchStateChange,
}) => {
  const searchClient = useMemo(() => {
    return clinia(appId, apiKey);
  }, [apiKey, appId]);

  const sourceCodeUrl = `https://github.com/clinia/react-vizion/tree/develop/stories/${linkedStoryGroup}.stories.js`;
  const playgroundLink = hasPlayground ? (
    <button
      onClick={linkTo(linkedStoryGroup, 'playground')}
      className="playground-url"
    >
      <span>Play with props</span>
    </button>
  ) : null;

  const footer = linkedStoryGroup ? (
    <div className="footer-container">
      {playgroundLink}
      <a
        href={sourceCodeUrl}
        className="source-code-url"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div>View source code</div>
      </a>
    </div>
  ) : null;

  const hits = hitsElement || <CustomHits />;

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
    <Vizion
      searchClient={searchClient}
      indexName={indexName}
      searchState={searchState}
      onSearchStateChange={setNextSearchState}
    >
      <Configure {...searchParameters} />
      <div>
        <div className="container widget-container">{children}</div>
        <div>
          <div
            style={linkedStoryGroup ? {} : { borderRadius: '0px 0px 5px 5px' }}
            className="container hits-container"
          >
            <div className="hit-actions">
              {searchBox ? (
                <SearchBox
                  translations={{
                    placeholder: 'Search into our products: phones, tv...',
                  }}
                />
              ) : null}
            </div>
            {hits}
          </div>
          {footer}
        </div>
      </div>
    </Vizion>
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
  appId: 'hrm',
  apiKey: 'KcLxBhVFP8ooPgQODlAxWqfNg657fTz9',
  indexName: 'meta',
  initialSearchState: {},
  onSearchStateChange: () => {},
};
