import React from 'react';
import './search-panel.css';
import PropTypes from 'prop-types';
export default class SearchPanel extends React.Component {
  render() {
    const { searchMovie } = this.props;

    return (
      <div className="input-container">
        <input
          type="text"
          className="form"
          placeholder="Type to search..."
          onChange={(e) => searchMovie(e.target.value)}
        />
      </div>
    );
  }
}
SearchPanel.defaultProps = {
  searchMovie: () => {},
};

SearchPanel.propTypes = {
  searchMovie: PropTypes.func,
};
