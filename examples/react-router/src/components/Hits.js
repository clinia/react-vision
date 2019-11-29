import notFound from '../static/images/empty-search@2x.png';
import React from 'react';
import { OpeningHours } from './OpeningHours';
import { connectHits } from 'react-vision-dom';

const Hit = ({ record, onRecordOver }) => {
  const {
    type,
    address: { streetAddress, place, regionCode },
    phones,
    openingHours,
  } = record;

  const mapLink = `https://www.google.ca/maps/dir//${streetAddress.replace(
    ' ',
    '+'
  )}`;

  return (
    <div
      className="card"
      key={record.id}
      onMouseEnter={() => onRecordOver(record)}
      onMouseLeave={() => onRecordOver(null)}
    >
      <div className="card-body">
        <div className="card-badge">
          <span>{type}</span>
        </div>
        <h3>{record.name}</h3>
        <div>
          <p
            style={{ marginTop: 10 }}
          >{`${streetAddress}, ${place} - ${regionCode}`}</p>
          <OpeningHours openingHours={openingHours} style={{ marginTop: 5 }} />
        </div>
      </div>
      <div className="card-footer">
        {Array.isArray(phones) && phones.length > 0 && (
          <span>
            <i className="fa fa-phone" style={{ color: '#5B81FF' }} />
            <a href={`tel://${phones[0].countryCode}${phones[0].number}`}>
              Call
            </a>
          </span>
        )}
        <span>
          <i className="fa fa-map-marker" style={{ color: '#2DCEBF' }} />
          <a href={mapLink} target="_blank" rel="noopener noreferrer">
            Direction
          </a>
        </span>
      </div>
    </div>
  );
};

export const NotFound = () => (
  <div className="notFound">
    <img src={notFound} alt="Content not found" />
    <div>
      <h3>No results found</h3>
      <p>
        Here are a couple solutions : check your spelling, remove filters or add
        more data to your workspace!
      </p>
    </div>
  </div>
);

export default connectHits(({ records, selectedRecord, onRecordOver }) => (
  <div className="hits">
    {Array.isArray(records) && records.length > 0 ? (
      records.map(record => {
        return (
          <Hit
            record={record}
            selectedRecord={selectedRecord}
            onRecordOver={onRecordOver}
          />
        );
      })
    ) : (
      <NotFound />
    )}
  </div>
));
