var app = new Vue(
  {
    el: "#root",
    data: {
      search: '',
      voteClass: '',
      resultsArr: [],
      // init: true,
      result: false,
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
        axios.get('https://api.themoviedb.org/3/search/movie?',{
          params: {
            api_key: '71648f6532d78651db76cf10430d87ef',
            // language: 'it-IT',
            page: '1',
            include_adult: 'false',
            query: this.search.trim().toLowerCase()
          }
        }).then((responseMovie) => {
          axios.get('https://api.themoviedb.org/3/search/tv?',{
            params: {
              api_key: '71648f6532d78651db76cf10430d87ef',
              // language: 'it-IT',
              page: '1',
              include_adult: 'false',
              query: this.search.trim().toLowerCase()
            }
          }).then((responseTv) => {
            this.resultsArr = responseMovie.data.results.concat(responseTv.data.results);
            if (this.resultsArr.length == 0) {
              this.result = true;
            } else {
              this.result = false;
            }
            this.search = '';
          })
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
      }
    },
    computed: {

    }
  }
);
console.log(3/2)
