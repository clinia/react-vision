import React, { Fragment } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import {
  GeoSearch,
  CustomMarker,
  Control,
} from '@clinia/react-vizion-dom-maps';
import { OpeningHours } from './OpeningHours';
import classnames from 'classnames';
import mapStyles from '../static/mapStyle.json';

const phoneFormatter = phone => {
  if (!phone) return phone;
  // Only numbers
  const newValue = phone.replace(/\D/g, '');
  let formattedValue = newValue;

  if (newValue.length >= 1) {
    formattedValue = `${newValue.substring(0, 3)}`;
  }

  if (newValue.length > 3) {
    formattedValue = `${formattedValue} ${newValue.substring(3, 6)}`;
  }
  if (newValue.length > 6) {
    formattedValue = `${formattedValue} ${newValue.substring(6, 10)}`;
  }

  return formattedValue;
};

const Tooltip = ({ hit }) => {
  const mapLink = `https://www.google.ca/maps/dir//${hit.address.streetAddress.replace(
    ' ',
    '+'
  )}`;

  return (
    <div className="example-tooltip">
      <div className="card-badge">
        <span>{hit.type}</span>
      </div>
      {hit.distance && <div>{hit.distance}</div>}
      <h3>{hit.name}</h3>
      <div>
        <a href={mapLink} target="_blank" rel="noopener noreferrer">
          Get directions
        </a>
        <OpeningHours
          openingHours={hit.openingHours}
          compact={true}
          style={{ marginTop: 5 }}
        />
        {Array.isArray(hit.phones) && hit.phones.length > 0 && (
          <a href={`tel://${hit.phones[0].countryCode}${hit.phones[0].number}`}>
            {phoneFormatter(hit.phones[0].number)}
          </a>
        )}
      </div>
    </div>
  );
};

export default function Map({ google, selectedRecord }) {
  const InfoWindow = new google.maps.InfoWindow({ width: 300 });

  const onClickMarker = (hit, marker) => {
    if (InfoWindow.getMap()) {
      InfoWindow.close();
    }

    const html = ReactDOMServer.renderToString(<Tooltip hit={hit} />);

    InfoWindow.setContent(html);

    InfoWindow.open(marker.getMap(), marker);
  };

  const renderGeoHit = hit => {
    return (
      <CustomMarker
        key={hit.id}
        hit={hit}
        anchor={{ x: 0, y: 5 }}
        onClick={({ marker }) => onClickMarker(hit, marker)}
      >
        <div
          className={classnames('custom-marker', {
            'custom-marker-active':
              selectedRecord && hit.id === selectedRecord.id,
          })}
        />
      </CustomMarker>
    );
  };

  return (
    <GeoSearch google={google} initialZoom={6} styles={mapStyles}>
      {({ hits }) => (
        <Fragment>
          <Control />
          {hits.map(renderGeoHit)}
        </Fragment>
      )}
    </GeoSearch>
  );
}
