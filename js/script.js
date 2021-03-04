var app = new Vue(
  {
    el: "#root",
    data: {
      result: false,
      search: '',
      isSearch: false,
      voteClass: '',
      title: '',
      genres: [],
      pageMovieCall: 1,
      pageTvCall: 1,
      movieTotPages: 0,
      tvTotPages: 0,
      genre: 'all',
      resultsArr: [],
      title: '',
      link: 'https://image.tmdb.org/t/p/w220_and_h330_face',
      flags: {
        en: 'img/en.png',
        it: 'img/it.png',
        fr: 'img/fr.png',
        de: 'img/de.png',
        ja: 'img/ja.png',
        es: 'img/es.png'
      }
    },
    methods: {
      searchMovie: function() {
        if (this.search.trim() == ' ' && this.title == '' || this.search.trim() == '' && this.title == '') {
          return
        }
        if (this.isSearch == true) {
          this.resultsArr = [];
          this.genre = 'all';
          this.isSearch = false;
        }
        this.result = false;
        if (this.title == '') {
          this.title = this.search;
        }
        // this.title = this.search;
        let promiseMovie = axios.get('https://api.themoviedb.org/3/search/movie?',{
          params: {
            api_key: '71648f6532d78651db76cf10430d87ef',
            // language: "it_IT",
            page: this.pageMovieCall,
            query: this.title.trim().toLowerCase()
          }
        });
        let promiseTV = axios.get('https://api.themoviedb.org/3/search/tv?',{
          params: {
            api_key: '71648f6532d78651db76cf10430d87ef',
            // language: "it_IT",
            page: this.pageTvCall,
            query: this.title.trim().toLowerCase()
          }
        });
        Promise.all([promiseMovie, promiseTV]).then((values) => {
          this.movieTotPages = values[0].data.total_pages;
          this.tvTotPages = values[1].data.total_pages;
          let newArr = values[0].data.results.concat(values[1].data.results);
          if (this.resultsArr.length == 0) {
            this.result = true;
          }
          for (let i=0; i < newArr.length;i++) {
            this.findCast(newArr[i]);
          }
          this.resultsArr.push(...newArr);
            // .sort((a,b) => b.popularity - a.popularity));
          this.search = '';
        });
      },

      findCast: function(result) {
        axios.get(`https://api.themoviedb.org/3/${typeof result.title !== 'undefined' ? 'movie' : 'tv'}/${result.id}/credits?`,{
          params: {
            api_key: '71648f6532d78651db76cf10430d87ef',
          }
        }).then(response => {
          result.cast = [];
          for (names of response.data.cast) {
            result.cast.push(names.name);
          }
          this.$forceUpdate();
        })
      },

      scrollUp: function(index) {
        let info = document.getElementsByClassName("infos");
        setTimeout(function() {
          info[index].scrollTop = 0;
        }, 300);
      },

      stars: function(result) {
        let stars = ["far fa-star","far fa-star","far fa-star","far fa-star","far fa-star"];
        let average = (Math.round(result.vote_average)/2);
        stars.forEach((value, index) => {
          if (index < average && (average - index) == 0.5) {
            stars[index] = 'fas fa-star-half-alt';
          } else if (index < average) {
            stars[index] = 'fas fa-star'
          }
        });
        return stars;
      },

      findGenres: function(arrayID) {
        return arrayID.map((e1,index) => {
          let str = '';
          this.genres.forEach(e2 => {
            if (e1 == e2.id) {
              str = e2.name;
              return
            }
          })
          return str
        })
      },
      scroll: function() {
        let myDiv = document.getElementById("main_view");
        let bottom = myDiv.scrollTop + myDiv.offsetHeight === myDiv.scrollHeight;
        if (bottom == true) {
          if (this.pageMovieCall <= this.movieTotPages || this.pageTvCall <= this.tvTotPages) {
            this.pageMovieCall += 1;
            this.pageTvCall += 1;
            this.searchMovie();
          }
        }
      }
    },
    computed: {
      genresInPage: function() {
        let genresArr = [];
        this.resultsArr.forEach((e1) => {
          this.findGenres(e1.genre_ids).forEach( e2 => {
            if (!genresArr.includes(e2)) {
              genresArr.push(e2);
            }
          })
        });
        return genresArr
      },
      filterResults: function() {
        if (this.genre == 'all') {
          return this.resultsArr
        } else {
          return this.resultsArr.filter(elem => this.findGenres(elem.genre_ids).includes(this.genre));
        }
      }
    },
    mounted: function()  {
      let promiseMovie = axios.get('https://api.themoviedb.org/3/genre/movie/list?',{
        params: {
          api_key: '71648f6532d78651db76cf10430d87ef',
        }
      });
      let promiseTV = axios.get('https://api.themoviedb.org/3/genre/tv/list?',{
        params: {
          api_key: '71648f6532d78651db76cf10430d87ef',
        }
      });
      Promise.all([promiseMovie, promiseTV]).then((values) => {
        this.genres = values[0].data.genres.concat(values[1].data.genres)
      });
    }
  }
);
