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

$('.remove.button').on('click', function(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
  $(event.target).siblings().children().find(':selected').each(function() {this.remove();});
});

// Event listener to the submit button to generate the DOAP content based 
// on the form.  
var build_doap = function(event) {
  var o = {'releases':[], 'specs':[], 'accounts':[]},
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

