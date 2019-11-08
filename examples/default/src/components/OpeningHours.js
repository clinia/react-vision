import React from 'react';
import moment from 'moment';

export const OpeningHours = ({ openingHours }) => {
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
      } else if (now.isAfter(startHour) && now.isAfter(endHour)) {
        openingHoursText = (
          <>
            <span className="open">Closed now</span>
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
