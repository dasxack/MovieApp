import React from 'react';
import './search-panel.css';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
export default class SearchPanel extends React.Component {
  render() {
    const { getSearchMovies, nameMovie } = this.props;

    return (
      <div className="input-container">
        <input
          type="text"
          className="form"
          placeholder="Type to search..."
          onChange={(e) => getSearchMovies(e.target.value)}
          value={nameMovie}
        />
      </div>
    );
  }
}
SearchPanel.defaultProps = {
  getSearchMovies: () => {},
  nameMovie: '',
};

SearchPanel.propTypes = {
  getSearchMovies: PropTypes.func,
  nameMovie: PropTypes.string,
};
