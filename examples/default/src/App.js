import React from 'react';
import './App.css';
import { Vision, SearchBox, Hits } from 'react-vision-dom';
import cliniasearch from 'cliniasearch/lite';
import logo from './static/images/logo.svg';
import notFound from './static/images/empty-search@2x.png';
import moment from 'moment';

const searchClient = cliniasearch('TODO', 'ClM5vDTmS4GWEL0aS7osJaRkowV8McuP', {
  hosts: {
    read: ['api.partner.staging.clinia.ca'],
    write: ['api.partner.staging.clinia.ca'],
  },
});

const index = searchClient.initIndex('health_facility');

// index.search('query', { queryType: 'prefix_last' }).then().catch();
index.search('query', { queryType: 'prefix_last' }, function(err, results) {});

const OpeningHours = ({ openingHours }) => {
  let openingHoursText;

  if (!openingHours) {
    openingHoursText = <span>No opening hours specified</span>;
  } else {
    const now = moment();

    const todayOpeningHourIntervals = openingHours[now.isoWeekday()];

    // No opening hours for today (null)
    if (!todayOpeningHourIntervals)
      openingHoursText = <span>No opening hours specified</span>;

    // Closed today
    if (todayOpeningHourIntervals.length === 0) {
      openingHoursText = <span>Closed today</span>;
    }

    // Opened today in one intervals
    else if (todayOpeningHourIntervals.length === 1) {
      var firstInterval = todayOpeningHourIntervals[0];

      const startHour = moment(firstInterval.start, 'HH:mm');
      const endHour = moment(firstInterval.end, 'HH:mm');

      if (firstInterval.start === '00:00' && firstInterval.end === '00:00') {
        openingHoursText = <span className="open">Open 24 hours today</span>;
      } else if (now.isBefore(startHour)) {
        openingHoursText = (
          <>
            <span className="open">Open today: </span>
            <span>
              {startHour.format('LT')} - {endHour.format('LT')}
            </span>
          </>
        );
      } else {
        openingHoursText = (
          <>
            <span className="open">Open now </span>
            <span>until {endHour.format('LT')}</span>
          </>
        );
      }
    }
  }

  return (
    <p>
      <span className="dot" />
      <span>{openingHoursText}</span>
    </p>
  );
};

const ExampleHitComponent = ({ searchResult }) => {
  const {
    type,
    address: { streetAddress, place, regionCode },
    geoPoint,
    phones,
    openingHours,
  } = searchResult;

  const mapLink = `https://www.google.ca/maps/dir/${streetAddress.replace(
    ' ',
    '+'
  )}/@${geoPoint.lat},${geoPoint.lng}/`;

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-badge">
          <span>{type}</span>
        </div>
        <h3>{searchResult.name}</h3>
        <div>
          <p>{`${streetAddress}, ${place} - ${regionCode}`}</p>
          <OpeningHours openingHours={openingHours} />
        </div>
      </div>
      <div className="card-footer">
        {Array.isArray(phones) && phones.length > 0 && (
          <span>
            <i class="fa fa-phone" style={{ color: '#5B81FF' }} />
            <a href={`tel://${phones[0].countryCode}${phones[0].number}`}>
              Call
            </a>
          </span>
        )}
        <span>
          <i class="fa fa-map-marker" style={{ color: '#2DCEBF' }} />
          <a href={mapLink} target="_blank">
            Direction
          </a>
        </span>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Vision searchClient={searchClient} indexName="health_facility">
      <div className="example-header">
        <img src={logo} />
        <SearchBox submit={<i class="fa fa-search"></i>} />
      </div>
      <div className="hits-body">
        <Hits
          hit={result => <ExampleHitComponent searchResult={result.record} />}
          noResultsFound={
            <div class="notFound">
              <img src={notFound} alt="Content not found" />
              <div>
                <h3>No results found</h3>
                <p>
                  Here are a couple solutions : check your spelling, remove
                  filters or add more data to your workspace!
                </p>
              </div>
            </div>
          }
        />
      </div>
    </Vision>
    // <div className="cvi-SearchBox">
    //   <div className="buttonInside">
    //     <input className="cvi-SearchBox-input" />
    //     <span className="cvi-SearchBox-header-span">WHAT</span>
    //     <button className="cvi-SearchBox-submit">Clear</button>
    //     <button className="cvi-SearchBox-clear">Search</button>
    //     <span className="loading" />
    //   </div>
    //   {mockResult.map((data: any) => (
    //     <CustomHitComponent searchResult={data} />
    //   ))}
    // </div>
  );
};

export default App;
