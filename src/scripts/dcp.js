(function($, window, document, undefined) {
  'use strict';

  window.dcp = {
    baseUrl: 'https://dcp.jboss.org/v1/rest',
    projects: [],
    people: [],
    selectedProject: null,
    selectedPerson: null,

    searchProject: function() {
      return $.get(dcp.baseUrl + '/suggestions/project', 
        {query: '_exists_:archived OR _missing_:archived', size: 500, field: '_source'})
      .then(function(data) {
        dcp.projects = data.responses[0].hits.hits.map(function(current, index) { 
          return current._source;
        }); 
      });
    },

    findPerson: function(name) {
      return $.ajax({
        url: dcp.baseUrl + '/search', 
        traditional: true,
        data: {
          "sys_type": 'contributor_profile',
          "query": name, 
          "field": ["profileUrl", "name", "sys_content_id", "thumbnailUrl"]
        }
      }) 
      .then(function(data) {
        dcp.people = data.hits.hits.map(function(current, index) { 
          current.fields.index = index;
          return current.fields;
        });
      });
    }
  };
})(jQuery, window, window.document);

