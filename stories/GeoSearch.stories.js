import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Configure } from 'react-vision-dom';
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

const apiKey = 'AIzaSyDlHBUbfxN4MTRuFyvFthwxJ_AWZ-zjAWA';
const endpoint = 'https://maps.googleapis.com/maps/api/js?v=weekly';
const initialZoom = 12;
const initialPosition = {
  lat: 45.5016889,
  lng: -73.567256,
};

stories.add('default', () => (
  <WrapWithHits indexName="health_facility" linkedStoryGroup="GeoSearch">
    <Configure perPage={20} />

    <Container>
      <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
        {google => (
          <GeoSearch google={google}>
            {({ records }) => (
              <Fragment>
                {records.map(record => (
                  <Marker key={record.id} hit={record} />
                ))}
              </Fragment>
            )}
          </GeoSearch>
        )}
      </GoogleMapsLoader>
    </Container>
  </WrapWithHits>
));
