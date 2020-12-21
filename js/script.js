var app = new Vue(
  {
    el: "#root",
    data: {
      search: '',
      voteClass: '',
      genres: [],
      resultsArr: [],
      result: false,
      cast: [],
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
        this.resultsArr = [];
        let promiseMovie = axios.get('https://api.themoviedb.org/3/search/movie?',{
          params: {
            api_key: '71648f6532d78651db76cf10430d87ef',
            // language: "it_IT",
            page: '1',
            query: this.search.trim().toLowerCase()
          }
        });
        let promiseTV = axios.get('https://api.themoviedb.org/3/search/tv?',{
          params: {
            api_key: '71648f6532d78651db76cf10430d87ef',
            // language: "it_IT",
            page: '1',
            query: this.search.trim().toLowerCase()
          }
        });
        Promise.all([promiseMovie, promiseTV]).then((values) => {
          this.resultsArr = values[0].data.results.concat(values[1].data.results).sort((a,b) => b.popularity - a.popularity);
          if (this.resultsArr.length == 0) {
            this.result = true;
          } else {
            this.result = false;
          }
          this.search = '';
        });
      },
      findCast: function(result) {
        this.cast = [];
        axios.get(`https://api.themoviedb.org/3/${typeof result.title !== 'undefined' ? 'movie' : 'tv'}/${result.id}/credits?`,{
          params: {
            api_key: '71648f6532d78651db76cf10430d87ef',
          }
        }).then((response) => {
          for (names of response.data.cast) {
            // manca gestire l'undefined
            if (this.cast.length < 5) {
              this.cast.push(names.name);
            }
          }
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
