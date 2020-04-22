import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Configure, connectHits } from '@clinia/react-vizion-dom';
import {
  GoogleMapsLoader,
  GeoSearch,
  Marker,
  CustomMarker,
  Redo,
  Control,
} from '@clinia/react-vizion-dom-gmaps';
import { WrapWithHits } from './utils';

const stories = storiesOf('GoogleMaps', module);

const Container = ({ children }) => (
  <div style={{ height: 500 }}>{children}</div>
);

Container.propTypes = {
  children: PropTypes.node.isRequired,
};

const apiKey = 'AIzaSyCinD8RBonNR0YccJKv6sHvT2_BGQiP2pw';
const endpoint = 'https://maps.googleapis.com/maps/api/js?v=weekly';
const initialZoom = 6;
const initialPosition = { lat: 45.410246, lng: -73.986345 };

stories
  .add('default', () => (
    <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
      <Configure perPage={20} />

      <Container>
        <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
          {google => (
            <GeoSearch google={google}>
              {({ hits }) => (
                <Fragment>
                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} />
                  ))}
                </Fragment>
              )}
            </GeoSearch>
          )}
        </GoogleMapsLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with default refinement', () => (
    <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
      <Configure perPage={20} />

      <Container>
        <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
          {google => (
            <GeoSearch
              google={google}
              defaultRefinement={{
                northEast: { lat: 45.7058381, lng: -73.47426 },
                southWest: { lat: 45.410246, lng: -73.986345 },
              }}
            >
              {({ hits }) => (
                <Fragment>
                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} />
                  ))}
                </Fragment>
              )}
            </GeoSearch>
          )}
        </GoogleMapsLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with refine disabled', () => (
    <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
      <Configure perPage={20} />

      <Container>
        <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
          {google => (
            <GeoSearch
              google={google}
              enableRefine={false}
              zoomControl={false}
              gestureHandling="none"
            >
              {({ hits }) => (
                <Fragment>
                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} />
                  ))}
                </Fragment>
              )}
            </GeoSearch>
          )}
        </GoogleMapsLoader>
      </Container>
    </WrapWithHits>
  ));

stories
  .add('with zoom & center', () => (
    <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
      <Configure perPage={20} />

      <Container>
        <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
          {google => (
            <GeoSearch
              google={google}
              initialZoom={initialZoom}
              initialPosition={initialPosition}
            >
              {({ hits }) => (
                <Fragment>
                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} />
                  ))}
                </Fragment>
              )}
            </GeoSearch>
          )}
        </GoogleMapsLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with map options', () => (
    <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
      <Configure perPage={20} />

      <Container>
        <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
          {google => (
            <GeoSearch google={google} streetViewControl>
              {({ hits }) => (
                <Fragment>
                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} />
                  ))}
                </Fragment>
              )}
            </GeoSearch>
          )}
        </GoogleMapsLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with <Marker> options', () => (
    <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
      <Configure perPage={20} />

      <Container>
        <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
          {google => (
            <GeoSearch google={google}>
              {({ hits }) => (
                <Fragment>
                  {hits.map(hit => (
                    <Marker
                      key={hit.id}
                      hit={hit}
                      label={hit.name}
                      onClick={() => {}}
                    />
                  ))}
                </Fragment>
              )}
            </GeoSearch>
          )}
        </GoogleMapsLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with <Marker> events', () => (
    <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
      <Configure perPage={20} />

      <Container>
        <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
          {google => (
            <GeoSearch google={google}>
              {({ hits }) => (
                <Fragment>
                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} onClick={action('click')} />
                  ))}
                </Fragment>
              )}
            </GeoSearch>
          )}
        </GoogleMapsLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with <Redo> component', () => (
    <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
      <Configure perPage={20} />

      <Container>
        <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
          {google => (
            <GeoSearch google={google} enableRefineOnMapMove={false}>
              {({ hits }) => (
                <Fragment>
                  <Redo />

                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} />
                  ))}
                </Fragment>
              )}
            </GeoSearch>
          )}
        </GoogleMapsLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with <Control> component', () => (
    <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
      <Configure perPage={20} />

      <Container>
        <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
          {google => (
            <GeoSearch google={google}>
              {({ hits }) => (
                <Fragment>
                  <Control />

                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} />
                  ))}
                </Fragment>
              )}
            </GeoSearch>
          )}
        </GoogleMapsLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with <Control> component disabled', () => (
    <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
      <Configure perPage={20} />

      <Container>
        <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
          {google => (
            <GeoSearch google={google} enableRefineOnMapMove={false}>
              {({ hits }) => (
                <Fragment>
                  <Control />

                  {hits.map(hit => (
                    <Marker key={hit.id} hit={hit} />
                  ))}
                </Fragment>
              )}
            </GeoSearch>
          )}
        </GoogleMapsLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with <CustomMarker>', () => (
    <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
      <Configure perPage={20} />

      <Container>
        <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
          {google => (
            <GeoSearch google={google}>
              {({ hits }) => (
                <Fragment>
                  <Control />

                  {hits.map(hit => (
                    <Fragment key={hit.id}>
                      <CustomMarker
                        hit={hit}
                        className="my-custom-marker"
                        anchor={{ x: 0, y: 5 }}
                      >
                        {hit.name}
                      </CustomMarker>
                    </Fragment>
                  ))}
                </Fragment>
              )}
            </GeoSearch>
          )}
        </GoogleMapsLoader>
      </Container>
    </WrapWithHits>
  ))
  .add('with <CustomMarker> events', () => (
    <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
      <Configure perPage={20} />

      <Container>
        <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
          {google => (
            <GeoSearch google={google}>
              {({ hits }) => (
                <Fragment>
                  <Control />

                  {hits.map(hit => (
                    <Fragment key={hit.id}>
                      <CustomMarker
                        hit={hit}
                        className="my-custom-marker"
                        anchor={{ x: 0, y: 5 }}
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
        </GoogleMapsLoader>
      </Container>
    </WrapWithHits>
  ));

stories.add('with InfoWindow', () => {
  class Example extends Component {
    static propTypes = {
      google: PropTypes.object.isRequired,
    };

    InfoWindow = new this.props.google.maps.InfoWindow();

    onClickMarker = ({ hit, marker }) => {
      if (this.InfoWindow.getMap()) {
        this.InfoWindow.close();
      }

      this.InfoWindow.setContent(hit.name);

      this.InfoWindow.open(marker.getMap(), marker);
    };

    renderGeoHit = hit => (
      <Marker
        key={hit.id}
        hit={hit}
        anchor={{ x: 0, y: 5 }}
        onClick={({ marker }) => {
          this.onClickMarker({
            hit,
            marker,
          });
        }}
      />
    );

    render() {
      const { google } = this.props;

      return (
        <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
          <Configure perPage={20} />

          <Container>
            <GeoSearch google={google}>
              {({ hits }) => <Fragment>{hits.map(this.renderGeoHit)}</Fragment>}
            </GeoSearch>
          </Container>
        </WrapWithHits>
      );
    }
  }

  return (
    <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
      {google => <Example google={google} />}
    </GoogleMapsLoader>
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
          anchor={{ x: 0, y: 5 }}
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
          indexName="health_facility"
          linkedStoryGroup="GeoSearch"
          hitsElement={
            <CustomHits
              selectedRecord={selectedRecord}
              onRecordOver={this.onRecordOver}
            />
          }
        >
          <Configure perPage={20} />

          <Container>
            <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
              {google => (
                <GeoSearch google={google}>
                  {({ hits }) => (
                    <Fragment>{hits.map(this.renderGeoRecord)}</Fragment>
                  )}
                </GeoSearch>
              )}
            </GoogleMapsLoader>
          </Container>
        </WrapWithHits>
      );
    }
  }

  return <Example />;
});
