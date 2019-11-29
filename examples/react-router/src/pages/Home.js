import React from 'react';
import { AutoComplete, Location } from 'react-vision-dom';
import logo from '../logo.svg';

export default class Home extends React.Component {
  onSubmit = event => {
    event.preventDefault();
    // goToExamplePage();
  };

  // goToExamplePage = () => {
  //   let queryParams = '';

  //   if (autoCompleteInputRef.value) {
  //     queryParams += `speciality=${autoCompleteInputRef.value}`;
  //   }

  //   if (locationInputRef.value) {
  //     queryParams += `&location=${locationInputRef.value}`;
  //   }

  //   history.push(`/search?${queryParams}`);
  // };

  render() {
    return (
      <div className="home">
        <div className="home-bg" />
        <div className="home-header">
          <img src={logo} alt="logo" />
        </div>
        <div className="home-container">
          <h1>
            Find a <br /> ressource
          </h1>
          <h3>Find and book a trusted professional now</h3>
          <div className="search">
            <div className="example-autoComplete">
              <div className="autocomplete-label">What</div>
              <AutoComplete submit={null} clear={null} />
            </div>
            <div className="example-location">
              <div className="autocomplete-label">Where</div>
              <Location
                onSubmit={this.onSubmit}
                types={['postcode', 'place', 'neighborhood']}
                country={['CA']}
                locale="en"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
