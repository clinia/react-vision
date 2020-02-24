import React, { useState } from 'react';
import './search.css';
import { AutoComplete, Location } from 'react-vision-dom';
import logo from '../static/images/logo.svg';
import { withRouter } from 'react-router';
import { GoogleMapsLoader } from 'react-vision-dom-maps';
import Map from '../components/Map';
import Hits from '../components/Hits';

const apiKey = 'AIzaSyCinD8RBonNR0YccJKv6sHvT2_BGQiP2pw';
const endpoint = 'https://maps.googleapis.com/maps/api/js?v=weekly';

const Example = ({ location, history }) => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const searchParams = new URLSearchParams(location.search);

  return (
    <>
      <div className="example-header">
        <img src={logo} onClick={() => history.push('/')} alt="logo" />
        <div className="example-autoComplete">
          <div className="autocomplete-label">What</div>
          <AutoComplete
            submit={<i className="fa fa-search"></i>}
            clear={<i className="fa fa-times"></i>}
            defaultRefinement={searchParams.get('speciality') || ''}
          />
        </div>
        <div className="example-location">
          <div className="autocomplete-label">Where</div>
          <Location
            types={['postcode', 'place', 'neighborhood']}
            country={['CA']}
            locale="en"
            defaultRefinement={searchParams.get('location') || ''}
          />
        </div>
      </div>
      <div className="container">
        <div className="hits-container">
          <Hits
            onRecordOver={setSelectedRecord}
            selectedRecord={selectedRecord}
          />
        </div>
        <div className="map-container">
          <GoogleMapsLoader apiKey={apiKey} endpoint={endpoint}>
            {google => <Map google={google} selectedRecord={selectedRecord} />}
          </GoogleMapsLoader>
        </div>
      </div>
    </>
  );
};

export default withRouter(Example);
