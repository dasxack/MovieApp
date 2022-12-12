import React from 'react';

import './app.css';

import { MovieContext } from '../movie-context/movie-context';
import SearchPanel from '../search-panel';
import { Alert, Spin, Pagination } from 'antd';
import 'antd/dist/antd.min.css';
import { debounce } from 'lodash';
import MoveServices from '../../services';
import MovieList from '../movie-list';
import Header from '../header';
export default class App extends React.Component {
  moveServices = new MoveServices();
  state = {
    loading: true,
    movieData: [],
    isErrors: false,
    errorMessage: '',
    nameMovie: '',
    numberPage: 1,
    totalPages: 0,
    tabPane: '1',
    genresList: [],
    guestSessionId: '',
  };

  componentDidMount() {
    if (!localStorage.getItem('guestSessionId')) {
      this.createGuestSession();
    } else {
      this.setState({
        guestSessionId: localStorage.getItem('guestSessionId'),
      });
    }

    this.getPopularMovie();
    this.getGenresList();
  }

  getPopularMovie = () => {
    this.setState({
      loading: true,
      totalPages: 0,
      numberPage: 1,
    });
    this.moveServices
      .getPopularMovie()
      .then((move) => {
        const res = move.total_results;

        this.setState({
          loading: false,
          isErrors: false,
          movieData: move.results,
          totalPages: res,
        });
      })
      .catch(this.onError);
  };
  debounceMovie = debounce((e) => {
    const searchMovies = this.state.nameMovie;

    e.length === 1 || e.length === 0
      ? this.moveServices
          .getPopularMovie()
          .then((move) => {
            this.setState({
              loading: false,
              isErrors: false,
              movieData: move.results,
              totalPages: move.total_pages,
            });
          })
          .catch(this.onError)
      : this.moveServices
          .getSearchMovies(searchMovies)
          .then((res) => {
            this.setState({
              loading: false,
              isErrors: false,
              movieData: res.results,
              totalPages: res.total_pages,

              numberPage: 1,
            });
          })
          .catch(this.onError);
  }, 1000);
  getSearchMovies = (e) => {
    this.setState({
      loading: true,
      nameMovie: e,
      totalPages: 0,
      numberPage: 1,
      movieData: [],
    });
    this.debounceMovie(this.state.nameMovie);
  };
  getGenresList = () => {
    this.moveServices
      .getGenersList()
      .then((res) => {
        this.setState({
          genresList: [...res.genres],
        });
      })
      .catch(this.onError);
  };

  onError = (err) => {
    this.setState({
      isErrors: true,
      loading: false,
      errorMessage: 'Извините, у нас неполадки',
    });
  };
  changePage = (page) => {
    const { nameMovie, tabPane, guestSessionId } = this.state;
    this.setState({
      loading: true,
      movieData: [],
    });

    nameMovie === '' && tabPane === '1'
      ? this.moveServices
          .getPopularMovie(page)
          .then((move) => {
            this.setState({
              loading: false,
              movieData: move.results,
              isErrors: false,
              numberPage: page,
            });
          })
          .catch(this.onError)
      : tabPane === '2'
      ? this.moveServices
          .getRatedMovies(guestSessionId, page)
          .then((item) => {
            this.setState({
              loading: false,
              isErrors: false,
              movieData: item.results,
              totalPages: item.total_pages,
              numberPage: page,
            });
          })
          .catch(() => {
            this.setState({
              loading: false,
              notFound: false,
              isError: true,
            });
          })
      : this.moveServices
          .getSearchMovies(nameMovie, page)

          .then((move) => {
            this.setState({
              loading: false,
              isErrors: false,
              movieData: move.results,
              totalPages: move.total_pages,
              nameMovie: nameMovie,
              numberPage: page,
            });
          })
          .catch(this.onError);
  };
  createGuestSession = () => {
    this.moveServices
      .guestSession()
      .then((body) => {
        localStorage.setItem('guestSessionId', body.guest_session_id);
        this.setState({
          guestSessionId: body.guest_session_id,
          Loading: false,
        });
      })
      .catch(this.onError);
  };
  getRatedMovies = () => {
    const { guestSessionId, numberPage } = this.state;

    this.setState({
      loading: true,
      notFound: false,
      isError: false,
      movieData: [],
    });
    this.moveServices
      .getRatedMovies(guestSessionId, numberPage)
      .then((item) => {
        this.setState({
          loading: false,
          movieData: item.results,
          totalPages: item.total_pages,
          numberPage,
        });
      })
      .catch(this.onError);
  };
  changeTab = (key) => {
    if (key === '2') {
      this.setState(
        {
          tabPane: key,
          numberPage: 1,
        },
        () => {
          this.getRatedMovies();
        }
      );
    } else {
      this.setState(
        {
          notFound: false,
          tabPane: key,
          numberPage: 1,
        },
        () => {
          this.getPopularMovie();
        }
      );
    }
  };
  render() {
    const {
      loading,
      movieData,
      isErrors,
      errorMessage,
      numberPage,
      totalPages,
      genresList,
      guestSessionId,
      tabPane,
      nameMovie,
    } = this.state;
    const resTotalPages = totalPages * 20 > 500 * 20 ? 500 : totalPages;
    const error = isErrors ? <Alert message="Error" description={errorMessage} type="error" showIcon /> : null;
    const context = { genresList, guestSessionId };
    const spinner = loading ? (
      <div className="spin">
        <Spin tip="Loading..." size="large" className="spin" />
      </div>
    ) : null;
    const content = !loading || !isErrors ? <MovieList moveData={movieData} /> : null;
    const notFound =
      movieData.length === 0 && !isErrors && !loading ? <Alert message="По вашемузапросу ничего не найдено" /> : null;
    const pagination =
      totalPages > 0 && !loading ? (
        <Pagination
          defaultCurrent={1}
          current={numberPage}
          total={resTotalPages * 20}
          showSizeChanger={false}
          onChange={this.changePage}
          pageSize={20}
        />
      ) : null;
    const checkingTheInternet = window.navigator.onLine;

    const search =
      tabPane === '1' ? <SearchPanel getSearchMovies={this.getSearchMovies} nameMovie={nameMovie} /> : null;
    return checkingTheInternet ? (
      <MovieContext.Provider value={context}>
        <section className="moviapp">
          <Header changeTab={this.changeTab} />
          {search}
          <section className="main">
            {error}
            {spinner}
            {content}
            {notFound}
            {pagination}
          </section>
        </section>
      </MovieContext.Provider>
    ) : (
      <div className="noInternet">
        <h1>Нуууууу????</h1>
        Может стоит интернет включить??
      </div>
    );
  }
}
