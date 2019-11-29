import React, { Fragment } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { GeoSearch, CustomMarker, Control } from 'react-vision-dom-maps';
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

const Tooltip = ({ record }) => {
  const mapLink = `https://www.google.ca/maps/dir//${record.address.streetAddress.replace(
    ' ',
    '+'
  )}`;

  return (
    <div className="example-tooltip">
      <div className="card-badge">
        <span>{record.type}</span>
      </div>
      {record.distance && <div>{record.distance}</div>}
      <h3>{record.name}</h3>
      <div>
        <a href={mapLink} target="_blank" rel="noopener noreferrer">
          Get directions
        </a>
        <OpeningHours
          openingHours={record.openingHours}
          compact={true}
          style={{ marginTop: 5 }}
        />
        {Array.isArray(record.phones) && record.phones.length > 0 && (
          <a
            href={`tel://${record.phones[0].countryCode}${record.phones[0].number}`}
          >
            {phoneFormatter(record.phones[0].number)}
          </a>
        )}
      </div>
    </div>
  );
};

export default function Map({ google, selectedRecord }) {
  const InfoWindow = new google.maps.InfoWindow({ width: 300 });

  const onClickMarker = (record, marker) => {
    if (InfoWindow.getMap()) {
      InfoWindow.close();
    }

    const html = ReactDOMServer.renderToString(<Tooltip record={record} />);

    InfoWindow.setContent(html);

    InfoWindow.open(marker.getMap(), marker);
  };

  const renderGeoHit = record => {
    return (
      <CustomMarker
        key={record.id}
        record={record}
        anchor={{ x: 0, y: 5 }}
        onClick={({ marker }) => onClickMarker(record, marker)}
      >
        <div
          className={classnames('custom-marker', {
            'custom-marker-active':
              selectedRecord && record.id === selectedRecord.id,
          })}
        />
      </CustomMarker>
    );
  };

  return (
    <GeoSearch google={google} initialZoom={6} styles={mapStyles}>
      {({ records }) => (
        <Fragment>
          <Control />
          {records.map(renderGeoHit)}
        </Fragment>
      )}
    </GeoSearch>
  );
}
