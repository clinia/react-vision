import React, { Fragment } from 'react';
import './Example.css';
import { Vision, Hits, AutoComplete, Configure } from 'react-vision-dom';
import logo from '../static/images/logo.svg';
import {
  ExampleHitComponent,
  ExampleNotFoundComponent,
} from '../components/ExampleHitComponent';
import searchClient from '../searchClientExample';
import { withRouter } from 'react-router';
import { GoogleMapsLoader, GeoSearch, Marker } from 'react-vision-dom-maps';

const apiKey = 'AIzaSyCinD8RBonNR0YccJKv6sHvT2_BGQiP2pw';
const endpoint = 'https://maps.googleapis.com/maps/api/js?v=weekly';
const initialZoom = 6;
const initialPosition = { lat: 45.410246, lng: -73.986345 };

const Example = ({ location }) => {
  const searchParams = new URLSearchParams(location.search);

  return (
    <Vision searchClient={searchClient} indexName="health_facility">
      <div className="example-header">
        <img src={logo} />
        <AutoComplete
          submit={<i className="fa fa-search"></i>}
          clear={<i className="fa fa-times"></i>}
          defaultRefinement={searchParams.get('speciality')}
        />
        {/* <SearchBox submit={<i className="fa fa-search"></i>} /> */}
      </div>
      <div className="container">
        <div className="hits-container">
          <Hits
            hit={result => <ExampleHitComponent searchResult={result.record} />}
            noResultsFound={<ExampleNotFoundComponent />}
          />
        </div>
        <div className="map-container">
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
        </div>
      </div>
    </Vision>
  );
};

export default withRouter(Example);
