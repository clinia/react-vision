import React from 'react';
import './App.css';
import { Vision, SearchBox, Hits } from 'react-vision-dom';
import cliniasearch from 'cliniasearch/lite';
import logo from './static/images/logo.svg';

const searchClient = cliniasearch('TODO', 'test', {
  protocol: 'http',
  hosts: {
    read: ['localhost:5000'],
    write: ['localhost:5000'],
  },
});

const ExampleHitComponent = ({ searchResult }) => {
  const {
    type,
    address: { streetAddress, place, regionCode },
  } = searchResult.record;

  console.log(searchResult.record);

  return (
    <div className="card-example">
      <div className="card-example-badge">
        <span>{type}</span>
      </div>
      <h3>{searchResult.record.name}</h3>
      <div>
        <p>{`${streetAddress}, ${place} - ${regionCode}`}</p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Vision searchClient={searchClient} indexName="health_facility">
      <div className="example-header">
        <img src={logo} />
        <SearchBox />
      </div>
      <div className="hits-body">
        <Hits hit={result => <ExampleHitComponent searchResult={result} />} />
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
