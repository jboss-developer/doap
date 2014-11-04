(function($, window, document, undefined) {
  'use strict';

  window.dcp = {
    baseUrl: 'https://dcp.jboss.org/v1/rest',
    projects: {},
    people: {},
    selectedProject: null,
    selectedPerson: null,

    searchProject: function() {
      $.get(dcp.baseUrl + '/suggestions/project', 
        {query: '_exists_:archived OR _missing_:archived', size: 500, field: '_source'})
      .done(function(data) {
        // TODO: this stuff needs to be done in a different function, searchProject should just set dcp.projects
        var template = '{{#hits}}<option data-project="{{fields.sys_project}}">{{_source.projectName}}</option>{{/hits}}';
        data.responses[0].hits.hits.map(function(current, index) { 
          this[current.fields.sys_project] = current._source;
          return this;
        }, dcp.projects);

        $('#searchResults').append(Mustache.render(template, data.responses[0].hits));
      });
    },

    findPerson: function(name) {
      $.ajax({
        url: dcp.baseUrl + '/search', 
        traditional: true,
        data: {
          "sys_type": 'contributor_profile',
          "query": name, 
          "field": ["profileUrl", "name", "sys_content_id"]
        }
      }) 
      .done(function(data) {
        // TODO: This should be done elsewhere also
        console.info(data);
        var template = '{{#hits}}<option data-person="{{fields.sys_content_id}}">{{fields.name.formatted}}</option>{{/hits}}';
        data.hits.hits.map(function(current, index) { 
          this[current.fields.sys_content_id] = current.fields;
          return this;
        }, dcp.people);

        $('#person-finder-search-results').append(Mustache.render(template, data.hits));
      });
    }
  };
})(jQuery, window, window.document);

