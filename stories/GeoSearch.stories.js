import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Configure, connectHits } from 'react-vision-dom';
import {
  GoogleMapsLoader,
  GeoSearch,
  Marker,
  CustomMarker,
  Redo,
  Control,
} from 'react-vision-dom-maps';
import { WrapWithHits } from './utils';

const stories = storiesOf('GeoSearch', module);

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
              {({ records }) => (
                <Fragment>
                  {records.map(record => (
                    <Marker key={record.id} record={record} />
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
              {({ records }) => (
                <Fragment>
                  {records.map(record => (
                    <Marker key={record.id} record={record} />
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
              {({ records }) => (
                <Fragment>
                  {records.map(record => (
                    <Marker key={record.id} record={record} />
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
              {({ records }) => (
                <Fragment>
                  {records.map(record => (
                    <Marker key={record.id} record={record} />
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
              {({ records }) => (
                <Fragment>
                  {records.map(record => (
                    <Marker key={record.id} record={record} />
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
              {({ records }) => (
                <Fragment>
                  {records.map(record => (
                    <Marker
                      key={record.id}
                      record={record}
                      label={record.name}
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
              {({ records }) => (
                <Fragment>
                  {records.map(record => (
                    <Marker
                      key={record.id}
                      record={record}
                      onClick={action('click')}
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
  .add('with <Redo> component', () => (
    <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
      <Configure perPage={20} />

      <Container>
        <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
          {google => (
            <GeoSearch google={google} enableRefineOnMapMove={false}>
              {({ records }) => (
                <Fragment>
                  <Redo />

                  {records.map(record => (
                    <Marker key={record.id} record={record} />
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
              {({ records }) => (
                <Fragment>
                  <Control />

                  {records.map(record => (
                    <Marker key={record.id} record={record} />
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
              {({ records }) => (
                <Fragment>
                  <Control />

                  {records.map(record => (
                    <Marker key={record.id} record={record} />
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
              {({ records }) => (
                <Fragment>
                  <Control />

                  {records.map(record => (
                    <Fragment key={record.id}>
                      <CustomMarker
                        record={record}
                        className="my-custom-marker"
                        anchor={{ x: 0, y: 5 }}
                      >
                        {record.name}
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
              {({ records }) => (
                <Fragment>
                  <Control />

                  {records.map(record => (
                    <Fragment key={record.id}>
                      <CustomMarker
                        record={record}
                        className="my-custom-marker"
                        anchor={{ x: 0, y: 5 }}
                        onClick={action('click')}
                      >
                        <span>{record.name}</span>
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

    onClickMarker = ({ record, marker }) => {
      if (this.InfoWindow.getMap()) {
        this.InfoWindow.close();
      }

      this.InfoWindow.setContent(record.name);

      this.InfoWindow.open(marker.getMap(), marker);
    };

    renderGeoHit = record => (
      <Marker
        key={record.id}
        record={record}
        anchor={{ x: 0, y: 5 }}
        onClick={({ marker }) => {
          this.onClickMarker({
            record,
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
              {({ records }) => (
                <Fragment>{records.map(this.renderGeoHit)}</Fragment>
              )}
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
  const CustomHits = connectHits(
    ({ records, selectedRecord, onRecordOver }) => (
      <div className="hits">
        {records.map(record => {
          const classNames = [
            'hit',
            'hit--health-facility',
            selectedRecord && selectedRecord.id === record.objectID
              ? 'hit--health-facility'
              : '',
          ];

          return (
            <div
              key={record.id}
              className={classNames.join(' ').trim()}
              onMouseEnter={() => onRecordOver(record)}
              onMouseLeave={() => onRecordOver(null)}
            >
              <div className="hit-content">
                <div>
                  <span>{record.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )
  );

  class Example extends Component {
    state = {
      selectedRecord: null,
    };

    onRecordOver = record =>
      this.setState(() => ({
        selectedRecord: record,
      }));

    renderGeoRecord = record => {
      const { selectedRecord } = this.state;

      const classNames = [
        'my-custom-marker',
        selectedRecord && selectedRecord.id === record.id
          ? 'my-custom-marker--active'
          : '',
      ];

      return (
        <CustomMarker
          key={record.id}
          record={record}
          anchor={{ x: 0, y: 5 }}
          onMouseEnter={() => this.onRecordOver(record)}
          onMouseLeave={() => this.onRecordOver(null)}
        >
          <div className={classNames.join(' ').trim()}>
            <span>{record.name}</span>
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
                  {({ records }) => (
                    <Fragment>{records.map(this.renderGeoRecord)}</Fragment>
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
