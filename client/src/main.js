let searchesTemplate = $('template#searches-template').html();
let renderSearches = Handlebars.compile(searchesTemplate);

let reposTemplate = $('template#repos-template').html();
let renderRepos = Handlebars.compile(reposTemplate);

let allSearches;
let allRepos;

$('#search-button').on('click', function() {
  let searchTerm = $('#new-search-field').val();
  
  $.ajax({
    type: 'GET',
    url: `https://api.github.com/users/${searchTerm}/repos`
  }).then(function(repos) {
    allRepos = repos;
    renderAllRepos(allRepos);
  });

  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/api/searches',
    data: {
      term: searchTerm,
      createdAt: new Date()
    }
  }).then(function(search) {
    allSearches = [search].concat(allSearches);
    renderAllSearches(allSearches);
    $('#new-search-field').val('');
  }, function(response) {
    toastr.error('Make sure you fill out the search field!');
  });
});

$.ajax({
  type: 'GET',
  url: 'http://localhost:3000/api/searches'
}).then(function(searches) {
  allSearches = searches;
  renderAllSearches(allSearches);
});

function renderAllSearches(searches) {
  let searchesHTML = renderSearches({
    searches: searches
  });
  $('#search-list').html(searchesHTML);
}

function renderAllRepos(repos) {
  let reposHTML = renderRepos({
    repos: repos
  });
  $('#repos-list').html(reposHTML);
  toastr.success('Successfully pulled repositories!');
}
