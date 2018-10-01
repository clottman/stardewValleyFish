import React from 'react';
import fish from '../.././data/fish';
import styles from './app.css';
import _ from 'underscore';
import Select from 'react-select';
import TimeSpan from './timeSpan.js';
import UnorderedList from './unorderedList.js';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allFish: fish,
            selectedLocations: [],
            selectedSeasons: [],
            selectedIsRaining: false,
        };
        const that = this;
        that.allLocations = [];
        fish.forEach(function (fish) {
            if (fish.location == null) {
                fish.location = ['Any'];
            }
            if (!Array.isArray(fish.location)) {
                fish.location = [fish.location];
            }
            that.allLocations = that.allLocations.concat(fish.location);

        });
        this.allLocations = _.uniq(this.allLocations);
        this.allSeasons = ['Spring', 'Summer', 'Fall', 'Winter'];


        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleSeasonChange = this.handleSeasonChange.bind(this);
        this.handleRainingChange = this.handleRainingChange.bind(this);
    }

    handleLocationChange(selectedLocations) {
        this.setState({ selectedLocations });
    };

    handleSeasonChange(selectedSeasons) {
        this.setState({ selectedSeasons });
    };

    handleRainingChange(event) {
        this.setState({ selectedIsRaining: event.target.checked });
    };

    getFishLocation(locations) {
        if (Array.isArray(locations)) {
            if (locations.length == 0) {
                return 'Anywhere';
            }
            return <UnorderedList>
                {locations.map((location) => <span key={location}>{location}</span>)}
            </UnorderedList>
        }
        return locations;
    }

    getFishRow(fish) {
        return (<tr key={fish.name}>
            <td>{fish.name}</td>
            <td>{fish.basePrice}</td>
            <td>{this.getFishLocation(fish.location)}</td>
            <td><TimeSpan startTime={fish.startTime} endTime={fish.endTime} /></td>
            <td>{fish.lengthRange}</td>
            <td>
              {fish.weather.length > 0 ? 
              <UnorderedList>
                  {fish.weather}
              </UnorderedList>
              : 'Any'}
            </td>
            <td>{fish.baseXP}</td>
            <td>
                <UnorderedList>
                    {fish.usedFor.map((usedFor) => <span key={usedFor}>{usedFor}</span>)}
                </UnorderedList>
            </td>
        </tr>);
    }

    anyRain(weather) {
        return weather.length == 0;
    }

    mapArrayToOptions(options) {
        return _.map(options, function (option) {
            return { value: option, label: option };
        });
    }

    render() {
        const that = this;
        const fishToShow = _.filter(this.state.allFish, function (fish, index) {
            const matchingLocation = that.state.selectedLocations.length == 0 || _.intersection(fish.location, _.pluck(that.state.selectedLocations, 'value')).length != 0;
            const matchingSeason = that.state.selectedSeasons.length == 0 || _.intersection(fish.season, _.pluck(that.state.selectedSeasons, 'value')).length != 0;
            let matchingIsRaining;
            const matchingRain = that.anyRain(fish.weather) || (that.state.selectedIsRaining && _.contains(fish.weather, 'Rain')) || (!that.state.selectedIsRaining && !_.contains(fish.weather, 'Rain'));
            return matchingLocation && matchingSeason && matchingRain;
        });
        return (<div>
            <h1>Hello, Stardew Valley!</h1>
            <p>Ever get tired of trying to figure out where you can find good fish on a given day in Stardew Valley? Try this tool!</p>
            <p>Use as many season or location filters as you'd like - using no filters is the same as using them all.</p>
            <p>Make sure to check Is Raining if it's raining today!</p>
            <div>
                <Select
                    className={styles.multiSelect}
                    placeholder='Locations'
                    isMulti={true}
                    value={that.state.selectedLocations}
                    onChange={that.handleLocationChange}
                    options={that.mapArrayToOptions(that.allLocations)}
                />
                <Select
                    className={styles.multiSelect}
                    placeholder='Seasons'
                    isMulti={true}
                    value={that.state.selectedSeasons}
                    onChange={that.handleSeasonChange}
                    options={that.mapArrayToOptions(that.allSeasons)}
                />
                <label
                    htmlFor='isRaining'>
                    <input name='isRaining' type='checkbox' checked={that.state.selectedIsRaining} onChange={that.handleRainingChange} />
                    Is Raining?
           </label>
            </div>
            <table className={styles.fishTable}>
                <thead>
                </thead>
                <tbody>
                      <tr>
                        <th>Name</th>
                        <th>Base Price</th>
                        <th>Locations</th>
                        <th>Times (24h)</th>
                        <th>Length Range</th>
                        <th>Weather</th>
                        <th>Base XP</th>
                        <th>Used for</th>
                      </tr>
                      {fishToShow.map(fish => this.getFishRow(fish))}
                </tbody>
            </table>
        </div>);
    }
};
