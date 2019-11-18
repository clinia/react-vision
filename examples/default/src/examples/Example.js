import React, { Fragment, useState } from 'react';
import './Example.css';
import { Vision, AutoComplete, Location } from 'react-vision-dom';
import logo from '../static/images/logo.svg';
import searchClient from '../searchClientExample';
import { withRouter } from 'react-router';
import { GoogleMapsLoader } from 'react-vision-dom-maps';
import ExampleGeoSearch from '../components/ExampleGeoSearch';
import ExampleCustomHits from '../components/ExampleHits';

const apiKey = 'AIzaSyCinD8RBonNR0YccJKv6sHvT2_BGQiP2pw';
const endpoint = 'https://maps.googleapis.com/maps/api/js?v=weekly';

const Example = ({ location }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const searchParams = new URLSearchParams(location.search);

  return (
    <Vision searchClient={searchClient} indexName="health_facility">
      <div className="example-header">
        <img src={logo} />
        <AutoComplete defaultRefinement={searchParams.get('speciality')} />
        <Location defaultRefinement={searchParams.get('location')} />
      </div>
      <div className="container">
        <div className="hits-container">
          <ExampleCustomHits
            onRecordOver={setSelectedRecord}
            selectedRecord={selectedRecord}
          />
        </div>
        <div className="map-container">
          <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
            {google => (
              <ExampleGeoSearch
                google={google}
                selectedRecord={selectedRecord}
                onRecordOver={setSelectedRecord}
              />
            )}
          </GoogleMapsLoader>
        </div>
      </div>
    </Vision>
  );
};

export default withRouter(Example);
