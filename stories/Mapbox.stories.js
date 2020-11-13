import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  Configure,
  connectHits,
  connectSearchBar,
  InfiniteHits,
} from '@clinia/react-vizion-dom';
import {
  MapboxLoader,
  GeoSearch,
  Marker,
  Redo,
  CustomMarker,
} from '@clinia/react-vizion-dom-mapbox';
import { WrapWithHits } from './utils';

const stories = storiesOf('Mapbox', module);

const Container = ({ children }) => (
  <div style={{ height: 500 }}>{children}</div>
);

Container.propTypes = {
  children: PropTypes.node.isRequired,
};

const accessToken =
  'pk.eyJ1IjoiZmVsaXhsZWNoYXQiLCJhIjoiY2p3Y2dicDAwMHY4bzQxcW55MGJ1dXczZyJ9.TRlV2LckuT0z49Eu1TSjRw';
const initialZoom = 6;
const initialPosition = { lat: 45.410246, lng: -73.986345 };

class WrappedSearchBar extends Component {
  static propTypes = {
    currentQueryRefinement: PropTypes.string,
    currentLocationRefinement: PropTypes.object,
    querySuggestionHits: PropTypes.arrayOf(PropTypes.object),
    locationHits: PropTypes.arrayOf(PropTypes.object),
    searchForQuerySuggestions: PropTypes.func,
    searchForLocations: PropTypes.func,
    refine: PropTypes.func,
  };

  state = {
    query: this.props.currentQueryRefinement || '',
    location: this.props.currentLocationRefinement || { name: '' },
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let state = {
      ...prevState,
    };
    if (nextProps.locationHits.length > 0) {
      state = {
        ...state,
        location: {
          ...state.location,
          position: nextProps.locationHits[0].geometry.location,
        },
      };
    }

    return state;
  }

  onQueryChange = e => {
    this.setState({ query: e.target.value });
    this.props.searchForQuerySuggestions(e.target.value);
  };

  onLocationChange = e => {
    this.setState({
      location: {
        name: e.target.value,
      },
    });
    this.props.searchForLocations(e.target.value);
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    this.props.refine(this.state);
  };

  render() {
    const { locationHits } = this.props;
    const { query, location } = this.state;
    return (
      <>
        <form onSubmit={this.handleSubmit} style={{ float: 'left' }}>
          <div>
            <input
              value={query}
              onChange={this.onQueryChange}
              placeholder="Search for resources"
            />
          </div>
          <div>
            <input
              value={location.name}
              onChange={this.onLocationChange}
              placeholder="Postal code"
            />
            <ul>
              {locationHits.map(hit => (
                <li key={hit.formattedAddress}>{hit.formattedAddress}</li>
              ))}
            </ul>
          </div>
          <button type="submit">Submit</button>
        </form>
      </>
    );
  }
}
const SearchBar = connectSearchBar(WrappedSearchBar);

const WrappedQuerySuggestionHits = ({ querySuggestionHits }) => {
  return (
    <ul>
      {querySuggestionHits.map(hit => (
        <li key={hit.id}>{hit.query}</li>
      ))}
    </ul>
  );
};
WrappedQuerySuggestionHits.propTypes = {
  querySuggestionHits: PropTypes.array,
};

const QuerySuggestionHits = connectSearchBar(WrappedQuerySuggestionHits);

stories
  .add('default', () => (
    <WrapWithHits indexName="meta" linkedStoryGroup="Mapbox">
      <Configure perPage={20} />

      <Container>
        <MapboxLoader accessToken={accessToken}>
          {mapboxgl => (
            <GeoSearch mapboxgl={mapboxgl}>
              {({ hits }) => (
                <>
                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} />
                  ))}
                </>
              )}
            </GeoSearch>
          )}
        </MapboxLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with default refinement', () => (
    <WrapWithHits indexName="meta" linkedStoryGroup="Mapbox">
      <Configure perPage={20} />

      <Container>
        <MapboxLoader accessToken={accessToken}>
          {mapboxgl => (
            <GeoSearch
              mapboxgl={mapboxgl}
              defaultRefinement={{
                northEast: { lat: 45.7058381, lng: -73.47426 },
                southWest: { lat: 45.410246, lng: -73.986345 },
              }}
            >
              {({ hits }) => (
                <>
                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} />
                  ))}
                </>
              )}
            </GeoSearch>
          )}
        </MapboxLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with refine disabled', () => (
    <WrapWithHits indexName="meta" linkedStoryGroup="Mapbox">
      <Configure perPage={20} />

      <Container>
        <MapboxLoader accessToken={accessToken}>
          {mapboxgl => (
            <GeoSearch
              mapboxgl={mapboxgl}
              enableRefine={false}
              zoomControl={false}
              gestureHandling="none"
            >
              {({ hits }) => (
                <>
                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} />
                  ))}
                </>
              )}
            </GeoSearch>
          )}
        </MapboxLoader>
      </Container>
    </WrapWithHits>
  ));

stories.add('with geocoder', () => (
  <WrapWithHits searchBox={false} indexName="meta" linkedStoryGroup="Mapbox">
    <Configure perPage={5} />
    <SearchBar
      geocoderProps={{
        types: [],
        country: ['CA'],
        perPage: 5,
      }}
    />
    <br />
    <br />
    <QuerySuggestionHits />
    <br />
    <br />

    <Container>
      <MapboxLoader accessToken={accessToken}>
        {mapboxgl => (
          <GeoSearch
            mapboxgl={mapboxgl}
            initialZoom={initialZoom}
            initialPosition={initialPosition}
            enableRefineOnMapMove={false}
            fitBoundsOptions={{ duration: 3000, animate: true }}
          >
            {({ hits }) => (
              <>
                {hits.map(hit => (
                  <Marker key={hit.id} hit={hit} />
                ))}
              </>
            )}
          </GeoSearch>
        )}
      </MapboxLoader>
    </Container>
    <InfiniteHits />
  </WrapWithHits>
));

stories
  .add('with zoom & center', () => (
    <WrapWithHits indexName="meta" linkedStoryGroup="Mapbox">
      <Configure perPage={20} />

      <Container>
        <MapboxLoader accessToken={accessToken}>
          {mapboxgl => (
            <GeoSearch
              mapboxgl={mapboxgl}
              initialZoom={initialZoom}
              initialPosition={initialPosition}
            >
              {({ hits }) => (
                <>
                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} />
                  ))}
                </>
              )}
            </GeoSearch>
          )}
        </MapboxLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with map options', () => (
    <WrapWithHits indexName="meta" linkedStoryGroup="Mapbox">
      <Configure perPage={20} />

      <Container>
        <MapboxLoader accessToken={accessToken}>
          {mapboxgl => (
            <GeoSearch
              mapboxgl={mapboxgl}
              style="mapbox://styles/mapbox/dark-v10"
            >
              {({ hits }) => (
                <>
                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} />
                  ))}
                </>
              )}
            </GeoSearch>
          )}
        </MapboxLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with <Marker> options', () => (
    <WrapWithHits indexName="meta" linkedStoryGroup="Mapbox">
      <Configure perPage={20} />

      <Container>
        <MapboxLoader accessToken={accessToken}>
          {mapboxgl => (
            <GeoSearch mapboxgl={mapboxgl}>
              {({ hits }) => (
                <>
                  {hits.map(hit => (
                    <Marker
                      key={hit.id}
                      hit={hit}
                      color="#1FB1CE"
                      onClick={() => {}}
                    />
                  ))}
                </>
              )}
            </GeoSearch>
          )}
        </MapboxLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with <Marker> events', () => (
    <WrapWithHits indexName="meta" linkedStoryGroup="Mapbox">
      <Configure perPage={20} />

      <Container>
        <MapboxLoader accessToken={accessToken}>
          {mapboxgl => (
            <GeoSearch mapboxgl={mapboxgl}>
              {({ hits }) => (
                <>
                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} onClick={action('click')} />
                  ))}
                </>
              )}
            </GeoSearch>
          )}
        </MapboxLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with <Redo> component', () => (
    <WrapWithHits indexName="meta" linkedStoryGroup="Mapbox">
      <Configure perPage={20} />

      <Container>
        <MapboxLoader accessToken={accessToken}>
          {mapboxgl => (
            <GeoSearch mapboxgl={mapboxgl} enableRefineOnMapMove={false}>
              {({ hits }) => (
                <>
                  <Redo />

                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} />
                  ))}
                </>
              )}
            </GeoSearch>
          )}
        </MapboxLoader>
      </Container>
    </WrapWithHits>
  ))
  // .add('with <Control> component', () => (
  //   <WrapWithHits indexName="meta" linkedStoryGroup="Mapbox">
  //     <Configure perPage={20} />

  //     <Container>
  //       <MapboxLoader accessToken={accessToken}>
  //         {mapboxgl => (
  //           <GeoSearch mapboxgl={mapboxgl}>
  //             {({ hits }) => (
  //               <>
  //                 <Control />

  //                 {hits.map(hit => (
  //                   <Marker key={hit.id} hit={hit} />
  //                 ))}
  //               </>
  //             )}
  //           </GeoSearch>
  //         )}
  //       </MapboxLoader>
  //     </Container>
  //   </WrapWithHits>
  // ));
  //   .add('with <Control> component disabled', () => (
  //     <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
  //       <Configure perPage={20} />

  //       <Container>
  //         <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
  //           {google => (
  //             <GeoSearch google={google} enableRefineOnMapMove={false}>
  //               {({ hits }) => (
  //                 <Fragment>
  //                   <Control />

  //                   {hits.map(hit => (
  //                     <Marker key={hit.id} hit={hit} />
  //                   ))}
  //                 </Fragment>
  //               )}
  //             </GeoSearch>
  //           )}
  //         </GoogleMapsLoader>
  //       </Container>
  //     </WrapWithHits>
  //   ))
  .add('with <CustomMarker>', () => (
    <WrapWithHits indexName="meta" linkedStoryGroup="Mapbox">
      <Configure perPage={20} />

      <Container>
        <MapboxLoader accessToken={accessToken}>
          {mapboxgl => (
            <GeoSearch mapboxgl={mapboxgl}>
              {({ hits }) => (
                <>
                  {hits.map(hit => (
                    <Fragment key={hit.id}>
                      <CustomMarker hit={hit} className="my-custom-marker">
                        {hit.name}
                      </CustomMarker>
                    </Fragment>
                  ))}
                </>
              )}
            </GeoSearch>
          )}
        </MapboxLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with <CustomMarker> events', () => (
    <WrapWithHits indexName="meta" linkedStoryGroup="Mapbox">
      <Configure perPage={20} />

      <Container>
        <MapboxLoader accessToken={accessToken}>
          {mapboxgl => (
            <GeoSearch mapboxgl={mapboxgl}>
              {({ hits }) => (
                <Fragment>
                  {hits.map(hit => (
                    <Fragment key={hit.id}>
                      <CustomMarker
                        hit={hit}
                        className="my-custom-marker"
                        onClick={action('click')}
                      >
                        <span>{hit.name}</span>
                      </CustomMarker>
                    </Fragment>
                  ))}
                </Fragment>
              )}
            </GeoSearch>
          )}
        </MapboxLoader>
      </Container>
    </WrapWithHits>
  ));

stories.add('with Panel', () => {
  class Example extends Component {
    static propTypes = {
      mapboxgl: PropTypes.object.isRequired,
    };

    Popup = new this.props.mapboxgl.Popup();

    onClickMarker = ({ hit, marker }) => {
      if (this.InfoWindow.getMap()) {
        this.InfoWindow.close();
      }

      this.InfoWindow.setContent(hit.name);

      this.InfoWindow.open(marker.getMap(), marker);
    };

    renderGeoHit = hit => {
      return (
        <Marker
          key={hit.id}
          hit={hit}
          onClick={({ map }) => {
            action('clicked');
            this.Popup.setLngLat([hit._geoPoint.lon, hit._geoPoint.lat])
              .setHTML('<h1> HELLLO POPUP</h1>')
              .addTo(map);
          }}
        />
      );
    };

    render() {
      const { mapboxgl } = this.props;

      return (
        <WrapWithHits indexName="meta" linkedStoryGroup="Mapbox">
          <Configure perPage={20} />

          <Container>
            <GeoSearch mapboxgl={mapboxgl}>
              {({ hits }) => <Fragment>{hits.map(this.renderGeoHit)}</Fragment>}
            </GeoSearch>
          </Container>
        </WrapWithHits>
      );
    }
  }

  return (
    <MapboxLoader accessToken={accessToken}>
      {mapboxgl => <Example mapboxgl={mapboxgl} />}
    </MapboxLoader>
  );
});

stories.add('with hits communication (custom)', () => {
  const CustomHits = connectHits(({ hits, selectedRecord, onRecordOver }) => (
    <div className="hits">
      {hits.map(hit => {
        const classNames = [
          'hit',
          'hit--health-facility',
          selectedRecord && selectedRecord.id === hit.objectID
            ? 'hit--health-facility'
            : '',
        ];

        return (
          <div
            key={hit.id}
            className={classNames.join(' ').trim()}
            onMouseEnter={() => onRecordOver(hit)}
            onMouseLeave={() => onRecordOver(null)}
          >
            <div className="hit-content">
              <div>
                <span>{hit.name}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ));

  class Example extends Component {
    state = {
      selectedRecord: null,
    };

    onRecordOver = hit =>
      this.setState(() => ({
        selectedRecord: hit,
      }));

    renderGeoRecord = hit => {
      const { selectedRecord } = this.state;

      const classNames = [
        'my-custom-marker',
        selectedRecord && selectedRecord.id === hit.id
          ? 'my-custom-marker--active'
          : '',
      ];

      return (
        <CustomMarker
          key={hit.id}
          hit={hit}
          onMouseEnter={() => this.onRecordOver(hit)}
          onMouseLeave={() => this.onRecordOver(null)}
        >
          <div className={classNames.join(' ').trim()}>
            <span>{hit.name}</span>
          </div>
        </CustomMarker>
      );
    };

    render() {
      const { selectedRecord } = this.state;

      return (
        <WrapWithHits
          indexName="meta"
          linkedStoryGroup="Mapbox"
          hitsElement={
            <CustomHits
              selectedRecord={selectedRecord}
              onRecordOver={this.onRecordOver}
            />
          }
        >
          <Configure perPage={20} />

          <Container>
            <MapboxLoader accessToken={accessToken}>
              {mapboxgl => (
                <GeoSearch mapboxgl={mapboxgl}>
                  {({ hits }) => (
                    <Fragment>{hits.map(this.renderGeoRecord)}</Fragment>
                  )}
                </GeoSearch>
              )}
            </MapboxLoader>
          </Container>
        </WrapWithHits>
      );
    }
  }

  return <Example />;
});
