import React from 'react';
import MovieCard from '../movie-card';
import PropTypes from 'prop-types';
import './movie-list.css';
const MovieList = ({ moveData }) => {
  const elements = moveData.map((el) => {
    const { id, ...itemProps } = el;

    return (
      <li className="movi-list-item" key={id}>
        <MovieCard {...itemProps} id={id} />
      </li>
    );
  });
  return <ul className="movi-list">{elements}</ul>;
};
MovieList.defaultProps = {
  moveData: [],
};

MovieList.propTypes = {
  moveData: PropTypes.array,
};
export default MovieList;
