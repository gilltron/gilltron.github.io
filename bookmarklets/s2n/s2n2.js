var metadata_url = window.prompt("Enter the URL of your metadata record: ");
var metadata_raw = metadata_url.replace('file', 'files')
//var metadata_url = "https://researchworkspace.com/files/6472827/metadata.json"

$.getJSON(metadata_raw)
    .then(metadata => {

    //general sections of the metdata record
    var citation_contacts = metadata.metadata.values.contacts.citation_contacts;
    var additional_contacts = metadata.metadata.values.contacts.credits;
    var time_range = metadata.metadata.values.time_period.coverage[0].range;
    var spatial_extent = metadata.metadata.values.spatial.bounds_and_description
    var data_tables = metadata.metadata.values.entity.data_table;

    //adds zeros to lat/long if needed
    const padDeg = (deg,padLen) => {
      padLen = padLen || 4;
      return Number(deg).toFixed(padLen);
    }

    //adds zeros to date parts if needed
    const padDatePart = (val,expLen)=>{
      expLen = expLen || 2;
      let str = String(val)
      let missingPad = expLen - str.length;
      if(missingPad > 0){
        str = new Array(missingPad).fill('0').join('') + str;
      }
        return str;
    }

    //encodes fetch body
    const encodeFormData = (data) => {
        return Object.keys(data)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
            .join('&');
    }

    //sends body with fetch
    function inputFormData(fetch_body) {

      fetch("https://www.nodc.noaa.gov/cgi-bin/s2n/s2n.pl", {
        "headers": {
          "accept": "application/xml, text/xml, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://www.nodc.noaa.gov/s2n/package3.html?submission_no=B5RC8A&submitter_no=1063&csrf_token=8d4f98149ff04dd0a3c9d67588eaea48",
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": fetch_body,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      });
    };

    //page 1: people & projects
    //maps contact role form fields to ISO fields
    var roleMap = {
                author:'principal investigator',
                originator:'primary point of contact',
                owner:'principal investigator',
                principalInvestigator:'principal investigator',
        }

    //defines responsible person fetch body and sends
    for (i in citation_contacts) {
      var person_metadata = {
        submission_no: 'B5RC8A',
        csrf_token: '618b9913f32f457596a781e8c27ccbf4',
        first: citation_contacts[i].person.first_name,
        last: citation_contacts[i].person.last_name,
        role: roleMap[citation_contacts[i].role],
        rp_email: citation_contacts[i].person.email,
        institution: citation_contacts[i].position.organization,
        action:'save',
        type: 'person',
        row_no: '1'
        selected_id: '-1'
      }

      inputFormData(encodeFormData(person_metadata));

    }

    //defines funding agency fetch body and sends via fetch (need a better ISO field)
    var funding_agency_metadata = {
      submission_no: 'B5RC8A',
      csrf_token: '7be238476c744e75a6526e738d82083c',
      action: 'save',
      type: 'funding_agency',
      row_no: '1',
      value: metadata.metadata.values.contacts.credits[0],
      selected_id: '-1'
    }

    inputFormData(encodeFormData(funding_agency_metadata));


    //defines related projects/programs fetch body and sends (need a better ISO field)
    var related_program_metadata = {
      submission_no: 'B5RC8A',
      csrf_token: '401a37e985cc4d4084da4197c01829f3',
      action: 'save',
      type: 'project',
      row_no: '1',
      value: metadata.metadata.values.contacts.credits[1],
      selected_id: '-1'
    }

    inputFormData(encodeFormData(related_program_metadata));

    //page 2: dates & locations
    //maps the form fields to ISO metadata fields
    var dates_locations_fields = {
      'start_date': time_range.start.year + "-" + padDatePart(time_range.start.month) + "-" + padDatePart(time_range.start.day),
      'end_date': time_range.end.year + "-" + padDatePart(time_range.end.month) + "-" + padDatePart(time_range.end.day),
      'n_boundary': padDeg(values.spatial.bounds_and_description.bounding_box[0].n),
      's_boundary': padDeg(values.spatial.bounds_and_description.bounding_box[0].s),
      'e_boundary': padDeg(values.spatial.bounds_and_description.bounding_box[0].e),
      'w_boundary': padDeg(values.spatial.bounds_and_description.bounding_box[0].w)
    }

    //loops through form fields to send values via fetch
    for (i in dates_locations_fields) {
      var dates_locations_metadata = {
        action: 'save',
        type: 'column',
        column_name: i,
        value: package_fields[i],
      submission_no: 'B5RC8A',
      csrf_token: 'b2259775b31940099563e41d878b3fea'
      }
    }

    inputFormData(encodeFormData(dates_locations_metadata));

    //maps form fields to ISO fields (need to find better ISO field for platform)
    var platform_fields = {
      'platform': metadata.metadata.values.contacts.credits[2],
      'sea_name': metadata.metadata.values.spatial.bounds_and_description.spatial_description
    }

    //makes fetch body for platform field & sea name + sends metadata via fetch
    for (i in platform_fields) {
      var platform_metadata = {
        submission_no: 'B5RC8A',
        csrf_token: 'f0ae21cacc1045de9cc1e8ae9f373391',
        action: 'save',
        type: i,
        row_no: '1',
        value: platform_fields[i],
        selected_id: '-1'
      }

      inputFormData(encodeFormData(platform_metadata));

    }

    // page 3: data types
    //defines fetch body and sends data for multiple parameters
    // TODO prompt for each parameter
    for (i in data_tables) {
      for (j in data_tables[i].attributes) {

        var parameter = data_tables[i].attributes[j].attribute_basics.code_name;

        if (data_tables[i].attributes[j].attribute_basics.units != undefined) {
          var units = data_tables[i].attributes[j].attribute_basics.units.unit;
        } else {
            var units = "Unknown";
          };

        var parameter_metadata = {
          submission_no: 'B5RC8A',
          csrf_token: '04ab859e933f425f8aeba2ad2e593144',
          data_type: parameter,
          obs_type: 'in situ',
          sampling_instrument: 'pump sampler',
          sna_method: 'NA',
          data_quality_info: 'NA',
          unit: units,
          MorC: 'M',
          action: 'save',
          type: 'data_type',
          row_no: '1',
          selected_id: '-1',
          obs_type_id: '-1',
          sampling_instrument_id: '34' 
        };
      
        inputFormData(encodeFormData(parameter_metadata));

      };

    };

    //page 4: package description
    //creates dataset author list  
    for(var i in contacts) {
            dataset_author_list = dataset_author_list
             + contacts[i].person.last_name
              + ", " + contacts[i].person.first_name
              if (i != contacts.length-1) {
                  dataset_author_list = dataset_author_list + "; "
              }
        };

    //maps form fields to ISO metadata
    var package_fields = {
      'title': metadata.metadata.values.description.title,
      'abstract': metadata.metadata.values.description.abstract,
      'author_list': dataset_author_list,
      'purpose': metadata.metadata.values.description.purpose,
      'reference': 'NA'
    }

    //loops through form fields to send values via fetch
    for (i in package_fields) {
      var package_metadata = {
        action: 'save',
        type: 'column',
        column_name: i,
        value: package_fields[i],
        submission_no: 'B5RC8A',
        csrf_token: 'b2259775b31940099563e41d878b3fea'
      }
    }

    inputFormData(encodeFormData(package_metadata));


location.reload();
window.alert("Done!");

});
