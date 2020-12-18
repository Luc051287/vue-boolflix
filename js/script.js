var app = new Vue(
  {
    el: "#root",
    data: {
      search: '',
      resultsArr: [],
      init: true,
      title: '',
      link: 'https://image.tmdb.org/t/p/w220_and_h330_face'
    },
    methods: {
      searchMovie: function() {
        axios.get('https://api.themoviedb.org/3/search/movie?',{
          params: {
            api_key: '71648f6532d78651db76cf10430d87ef',
            language: 'it-IT',
            page: '1',
            include_adult: 'false',
            query: this.search.trim().toLowerCase()
          }
        }).then((response) => {
          this.init = false;
          console.log(response.data.results);
          this.resultsArr = response.data.results;
          console.log(this.resultsArr);
        })
      }
    },
    computed: {

    }
  }
);
