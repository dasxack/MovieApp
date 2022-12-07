import './move-services.css';

export default class MoveServices {
  async getResults(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  }
  popularMovie = async (page = 1) => {
    const res = await this.getResults(
      `https://api.themoviedb.org/3/movie/popular?api_key=bcac95abbfe6a45c7e1a514a356f6586&language=en-US&page=${page}`
    );
    return res;
  };

  searchMovies = async (nameMovie = 'return', page = 1) => {
    const res = await this.getResults(
      `https://api.themoviedb.org/3/search/movie?api_key=bcac95abbfe6a45c7e1a514a356f6586&language=en-US&query=${nameMovie}&page=${page}&include_adult=false`
    );
    return res;
  };

  getGenersList = async () => {
    const res = await this.getResults(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=bcac95abbfe6a45c7e1a514a356f6586`
    );
    return res;
  };
  guestSession = async () => {
    const res = await this.getResults(
      `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=bcac95abbfe6a45c7e1a514a356f6586`
    );

    return res;
  };
  setMovieRating = async (id, guestSessionToken, rate) => {
    const url = `https://api.themoviedb.org/3/movie/${id}/rating?api_key=bcac95abbfe6a45c7e1a514a356f6586&guest_session_id=${guestSessionToken}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        value: rate,
      }),
    });
    if (!res.ok) {
      throw new Error('server error');
    }
    return res.json();
  };
  deleteRateMovie = async (id, guestSessionToken) => {
    const url = `https://api.themoviedb.org/3/movie/${id}/rating?api_key=bcac95abbfe6a45c7e1a514a356f6586&guest_session_id=${guestSessionToken}`;

    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
    });
    if (!res.ok) {
      throw new Error('server error');
    }

    return res.json();
  };

  getRatedMovies = async (guestSessionToken, page = 1) => {
    const res = await this.getResults(
      `https://api.themoviedb.org/3/guest_session/${guestSessionToken}/rated/movies?api_key=bcac95abbfe6a45c7e1a514a356f6586&page=${page}`
    );
    return res;
  };
}
