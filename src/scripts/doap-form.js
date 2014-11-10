(function($, window, document, undefined) {
  'use strict';

  $(document).on('open.fndtn.reveal', '[data-reveal]', dcp.searchProject());

  $('#findPerson').on('click', function(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    dcp.findPerson($('#person-finder-form-name').val(''));
    $('#person-finder-search-results').hide();
    $('#person-finder').foundation('reveal', 'open');
  });

  $('#person-finder-form').on('submit', function(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    dcp.findPerson($('#person-finder-form-name').val()).then(function(data) {
      var template = '{{#people}}<li class="personItem" data-person-index="{{index}}"><strong>{{name.formatted}}</strong><br>{{sys_content_id}}<br><img src="{{{thumbnailUrl}}}"></li>{{/people}}';
      $('#person-finder-search-results').empty();
      $('#person-finder-search-results').html(Mustache.render(template, dcp));
      $('#person-finder-search-results li').on('click', selectPerson);
      $('#person-finder-search-results').show();
    });
  });

  function selectPerson(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    dcp.selectedPerson = dcp.people[$(event.currentTarget).data('person-index')];

    $('#first-name').val(dcp.selectedPerson.name.givenName);
    $('#last-name').val(dcp.selectedPerson.name.familyName);

    var profileUrl = dcp.selectedPerson.profileUrl;
    $('#community-account').val(profileUrl.slice(profileUrl.lastIndexOf('/') + 1));

    $('#person-finder').foundation('reveal', 'close');
  }

  $('#searchResults').on('change', function(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    dcp.selectedProject = dcp.projects[$(event.target).find(':selected').data('project')];
    // TODO: fill in page info
    $('#name').val(dcp.selectedProject.sys_project_name);
    $('#homepage').val(dcp.selectedProject.sys_url_view);
    $('#shortdesc').val(dcp.selectedProject.sys_description);
    $('#desc').val(dcp.selectedProject.description);
    $('#blogURL').val(dcp.selectedProject.blogLink);

    if (dcp.selectedProject.githubLink) { var gitOption =
      $('option[value=GitRepository]'); gitOption.attr('selected', true);
      gitOption.parent().change();
      $('input[name=repoLocation]').val(dcp.selectedProject.githubLink + '.git');
      $('input[name=repoBrowse]').val(dcp.selectedProject.githubLink); 
    }

    if (dcp.selectedProject.sys_url_view.indexOf('apache') > 0) {
      $('#vendor').find('option[value=Apache]').attr('selected', true);
    } else if (dcp.selectedProject.sys_url_view.indexOf('eclipse') > 0) {
      $('#vendor').find('option[value=Eclipse]').attr('selected', true);
    } else {
      $('#vendor').find('option[value="Red Hat"]').attr('selected', true);
    }

    if (dcp.selectedProject.jiraLink) {
      $('#issueDB').val(dcp.selectedProject.jiraLink);
    } else if (dcp.selectedProject.issueTrackerLink) {
      $('#issueDB').val(dcp.selectedProject.issueTrackerLink);
    }

    $('#licenseURL').find('option[value*=' + dcp.selectedProject.license + ']').first().attr('selected', true);

    if (dcp.selectedProject.mailingListLink) {
      $('#mailingListURL').val(dcp.selectedProject.mailingListLink);
    }

    $('#logoURL').val('http://static.jboss.org/' + dcp.selectedProject.sys_project + '/images/' + dcp.selectedProject.sys_project + '_200x150.png');

    $('#project-chooser').foundation('reveal', 'close');
  });

  $('a[role=tabbutton]').on('click', function(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    var tabButton = $('.tabs > li > a[href=' + $(event.target).attr('href') + ']'),
        currentTab = $('section[role=tabpanel].active'),
        newTab = $(tabButton.attr('href'));

    $('.tab-title > a').each(function() {
      $(this).attr('aria-selected', false);
      $(this).parent().removeClass('active');
    });
    tabButton.attr('aria-selected', true);
    tabButton.parent().addClass('active');

    // Hide current tab
    currentTab.removeClass('active');
    currentTab.attr('aria-hidden', true);
    
    // show new tab
    newTab.addClass('active');
    currentTab.attr('aria-hidden', false);
  });

  $('#addPerson').on('click', function(event) {
    var firstName = $('#first-name'),
        lastName = $('#last-name'),
        communityAccount = $('#community-account'),
        role = $('#role');

    event.preventDefault();

    if (firstName.val().length !== 0 && lastName.val().length !== 0 && role.val().length !== 0) {
      // Add to the selection
      $('#people-container').append('<option data-first-name="' + firstName.val() + 
          '" data-last-name="' + lastName.val() +'" data-role="' + role.val() + 
          '" data-community="' + communityAccount.val() + '">' + firstName.val() + ' ' + lastName.val() + '</option>');

      // Clear the values
      $.each([firstName, lastName, communityAccount, role], clearField);
    } else {
      $.each([firstName, lastName, role], invalidateField);
    }
  });

  $('#addVersion').on('click', function(event) {
    var releaseName = $('#version-release-name'),
        revision = $('#version-revision'),
        created = $('#version-created');

    event.preventDefault();

    if (revision.val().length !== 0 && created.val().length !== 0) {
      // Add to the selection
      $('#versions-container').append('<option data-release-name="' + releaseName.val() + 
          '" data-revision="' + revision.val() +'" data-created="' + created.val() + 
          '">' + revision.val() + ' ' + releaseName.val() + '</option>');

      // Clear the values
      $.each([releaseName, revision, created], clearField);
    } else {
      $.each([revision, created], invalidateField);
    }
  });

  $('#addSpec').on('click', function(event) {
    var specName = $('#spec-name'),
        specDesc = $('#spec-desc'),
        specUrl = $('#spec-url');

    event.preventDefault();

    if (specName.val().length !== 0) {
      // Add to the selection
      $('#specs-container').append('<option data-spec-name="' + specName.val() + 
          '" data-spec-desc="' + specDesc.val() +'" data-spec-url="' + specUrl.val() + 
          '">' + specName.val() + '</option>');

      // Clear the values
      $.each([specName, specDesc, specUrl], clearField);
    } else {
      $.each([specName], invalidateField);
    }
  });

  $('#addAccount').on('click', function(event) {
    var accountName = $('#account-name'),
        accountHomepage = $('#account-homepage');

    event.preventDefault();

    if (accountName.val().length !== 0 && accountHomepage.val().length !== 0) {
      // Add to the selection
      $('#accounts-container').append('<option data-account-name="' + accountName.val() + 
          '" data-account-homepage="' + accountHomepage.val() + '">' + accountName.val() + 
          ' ' + accountHomepage.val() + '</option>');

      // Clear the values
      $.each([accountName, accountHomepage], clearField);
    } else {
      $.each([accountName, accountHomepage], invalidateField);
    }
  });

  $('#addConsume').on('click', function(event) {
    var consumeUrl = $('#consume-url-entry');

    event.preventDefault();

    if (consumeUrl.val().length !== 0) {
      // Add to the selection
      $('#consume-container').append('<option data-consume-url="' + consumeUrl.val() + '">' +
          consumeUrl.val() + '</option>');

      // Clear the values
      $.each([consumeUrl], clearField);
    } else {
      $.each([consumeUrl], invalidateField);
    }
  });

  $('.remove.button').on('click', function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    $(event.target).siblings().children().find(':selected').each(function() {this.remove();});
  });

  // Event listener to the submit button to generate the DOAP content based 
  // on the form.  
  var build_doap = function(event) {
    var o = {'releases':[], 'specs':[], 'accounts':[], 'consumesProject': []},
        release_names = ['releaseName', 'revision', 'created'],
        spec_names = ['specName', 'specDecs', 'seeAlsoURL'],
        account_names = ['accountName', 'serviceHomepage'],
        people_names = ['first_name', 'last-name', 'community-account', 'role'],
        form = $('#doap-form'),
        a = $('#doap-form').serializeArray();

    event.preventDefault();
    event.stopImmediatePropagation();

    $.each(a, function() {
      if (this.name) {
        // check to see if it's a spec, online account or version, then create an
        // object for it and push the object to an array for
        // use in the templates
        if (people_names.indexOf(this.name) !== -1 || account_names.indexOf(this.name) !== -1 ||
            spec_names.indexOf(this.name) !== -1 || release_names.indexOf(this.name) !== -1) {
          // people, accounts, specs, releases will be handled differently
        } else {
          if (this.value) {
            if ("language".indexOf(this.name) !== -1) {
              o.language = $('select[name=language]').val();
            } else {
              o[this.name] = this.value;
            }
          }
        }
      } 
    });

    // TODO: do this for versions, specs, accounts
    // Adding people
    $("#people-container > option").each(function() {
      var elm = $(this),
          role = $(this).data("role");

        if (typeof o[role] === "undefined") {
          o[role] = [];
        }
        var person = { firstName : elm.data("first-name"), 
                       lastName : elm.data("last-name"), 
                       community : elm.data("community")
        };
        o[role].push(person);
    });

    // Adding Versions
    $("#versions-container > option").each(function() {
      var elm = $(this);

      var version = { releaseName : elm.data("release-name"), 
                      created : elm.data("created"), 
                      revision : elm.data("revision")
        };
        o.releases.push(version);
    });

    // Adding Specs
    $("#specs-container > option").each(function() {
      var elm = $(this);

      var spec = { specName : elm.data("spec-name"), 
                   specDesc : elm.data("spec-desc"), 
                   seeAlsoURL : elm.data("spec-url")
        };
        o.specs.push(spec);
    });
    
    // Adding consumes
    $("#consume-container > option").each(function() {
      var elm = $(this);

      o.consumesProject.push(elm.data('consume-url'));
    });

    // Adding Accounts
    $("#accounts-container > option").each(function() {
      var elm = $(this);

      var account = { accountName : elm.data("account-name"), 
                   serviceHomepage : elm.data("account-homepage") 
        };
        o.accounts.push(account);
    });

    $.each(['releases', 'specs', 'accounts'], function() {
      if (o[this].length === 1 && Object.keys(o[this][0]).length === 0) {
        o[this] = [];
      }
    });

    var downloadButton = $('#download-button'),
        template = $('#rdf_template').text(),
        doapModal = $('#doap-modal'),
        doapCode = $('#doap-code'),
        rdf = Mustache.render(template, o);
    doapCode.text(rdf);
    doapModal.foundation('reveal', 'open');
    downloadButton.attr('href', 'data:application/rdf+xml;charset=utf-8,' + encodeURIComponent(rdf)); 
    downloadButton.attr('download', 'doap.rdf');
    return false;
  }; 

  $('#doap-form').on('submit valid valid.fndtn.abide', build_doap); 

  $('#repositorytype').on('change', function(event) {
    // Hide everything so we don't get the wrong items if they change
    // the type
      $('.repository').each(function() { 
        $(this).hide(); 
        $('input', this).each(function() { 
          $(this).attr('required', false); 
        });
      });
    var selectedValue = $('option:selected', this).val(),
        browseGroup = $('#repoBrowseGroup'),
        moduleGroup = $('#repoModuleGroup'),
        locationGroup = $('#repoLocationGroup');
    browseGroup.show();
    if (selectedValue === 'CVSRepository' || selectedValue === 'BKRepository' || selectedValue === 'ArchRepository') {
      moduleGroup.show();
      moduleGroup.attr('required', 'true');
      $('input', moduleGroup).attr('required', true);
      if (selectedValue === 'CVSRepository') {
        var anonRoot = $('#repoAnonRoot');
        anonRoot.show();
        $('input', anonRoot).attr('required', true); 
      } else {
        locationGroup.show();
        $('input', locationGroup).attr('required', true);
      }
    } else {
      locationGroup.show();
      $('input', locationGroup).attr('required', true);
    } 
  });
}(jQuery, window, window.document));
