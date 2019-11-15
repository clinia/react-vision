import React from 'react';
import { connectHits } from 'react-vision-dom';
import { ExampleHit } from './ExampleHit';

export default connectHits(({ records, selectedRecord, onRecordOver }) => (
  <div className="hits">
    {records.map(record => {
      return (
        <ExampleHit
          record={record}
          selectedRecord={selectedRecord}
          onRecordOver={onRecordOver}
        />
      );
    })}
  </div>
));
