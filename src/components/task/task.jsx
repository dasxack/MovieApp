import React from 'react';
import { cahgeText } from './utils';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { MovieContext } from '../movie-context/movie-context';
import './task.css';
import RateStars from '../rate-stars/rate-stars';
import pictureDefault from './img/Tom.jpg';

export default class Task extends React.Component {
  roundVote = (vote) => {
    return vote.toFixed(1);
  };
  createGenresFilm = (genres) => {
    const { genre_ids } = this.props;
    const filmGenres = [];
    for (let id of genre_ids) {
      genres.forEach((el) => {
        if (el.id === id) {
          filmGenres.push(el.name);
        }
      });
    }
    const elements = filmGenres.map((el) => {
      const res = el;
      return <button key={el}>{res}</button>;
    });
    return elements;
  };
  render() {
    const { poster_path, title, overview, release_date, vote_average, id } = this.props;
    const colorVote = {
      border:
        vote_average >= 0 && vote_average < 3
          ? '2px solid #E90000'
          : vote_average >= 3 && vote_average < 5
          ? '2px solid #E97E00'
          : vote_average > 5 && vote_average < 7
          ? '2px solid #E9D100'
          : '2px solid #66E900',
    };
    return (
      <MovieContext.Consumer>
        {(context) => {
          return (
            <>
              <span className="poster">
                <img
                  alt="poster"
                  src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : pictureDefault}
                ></img>
              </span>
              <div className="view">
                <div className="title_container">
                  <h2>{title}</h2>
                  <span style={colorVote} className="vote">
                    {this.roundVote(vote_average)}
                  </span>
                </div>
                <span className="date">
                  {release_date && format(new Date(release_date.split('-')), 'MMMM q, yyyy')}
                </span>
                <span className="view-buttons">{this.createGenresFilm(context.genresList)}</span>
                <span className="description">{cahgeText(overview)}</span>
                <RateStars guestSessionId={context.guestSessionId} id={id} />
              </div>
            </>
          );
        }}
      </MovieContext.Consumer>
    );
  }
}
Task.defaultProps = {
  genre_ids: [],
  poster_path: '',
  title: 'Нет названия',
  overview: '',
  release_date: '',
  vote_average: 0,
  id: 0,
};

Task.propTypes = {
  genre_ids: PropTypes.array,
  poster_path: PropTypes.string,
  title: PropTypes.string,
  overview: PropTypes.string,
  release_date: PropTypes.string,
  vote_average: PropTypes.number,
  id: PropTypes.number,
};
