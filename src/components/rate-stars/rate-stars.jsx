import React, { Component } from 'react';
import MoveServices from '../../services';
import { Rate } from 'antd';
import PropTypes from 'prop-types';
import './rate-stars.css';

export default class RateStars extends Component {
  state = {
    ratingValue: localStorage.getItem(`${this.props.id}`) || 0,
  };
  setMovieRating = (rate) => {
    const { guestSessionId, id } = this.props;
    const moveServices = new MoveServices();
    this.setState({
      ratingValue: rate,
    });
    if (rate === 0) {
      moveServices.deleteRateMovie(id, guestSessionId);
    }
    if (rate > 0) {
      moveServices.setMovieRating(id, guestSessionId, rate);
      localStorage.setItem(`${id}`, `${rate}`);
    }
  };
  render() {
    return (
      <Rate
        count={10}
        value={this.state.ratingValue}
        onChange={(rate) => {
          this.setMovieRating(rate);
        }}
      />
    );
  }
}
RateStars.defaultProps = {
  guestSessionId: '',
  id: 0,
};

RateStars.propTypes = {
  guestSessionId: PropTypes.string,
  id: PropTypes.number,
};
