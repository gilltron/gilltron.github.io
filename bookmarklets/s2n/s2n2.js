var metadata_url = window.prompt("Enter the URL of your metadata record: ");
var metadata_raw = metadata_url.replace('file', 'files')
//var metadata_url = "https://researchworkspace.com/files/6472827/metadata.json"

$.getJSON(metadata_raw)
    .then(metadata => {

    //keys to the cookie jar
    var parsedUrl = new URL(window.location.href);
    var csrf_token = parsedUrl.searchParams.get('csrf_token');
    var submitter_no = parsedUrl.searchParams.get('submitter_no');
    var submission_no = parsedUrl.searchParams.get('submission_no');

    //general sections of the metadata record
    var citation_contacts = metadata.metadata.values.contacts.citation_contacts;
    var additional_contacts = metadata.metadata.values.contacts.credits;
    var time_range = metadata.metadata.values.time_period.coverage[0].range;
    var spatial_extent = metadata.metadata.values.spatial.bounds_and_description;
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
        "referrer": "https://www.nodc.noaa.gov/s2n/package3.html?submission_no=" + submission_no + "&submitter_no=" + submitter_no + "&csrf_token=" + csrf_token,
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

    //loops through multiple contacts, defines responsible person fetch body and sends
    for (i in citation_contacts) {
      var person_metadata = {
        submission_no: submission_no,
        csrf_token: csrf_token,
        first: citation_contacts[i].person.first_name,
        last: citation_contacts[i].person.last_name,
        role: roleMap[citation_contacts[i].role],
        rp_email: citation_contacts[i].address.email,
        institution: citation_contacts[i].position.organization,
        action:'save',
        type: 'person',
        row_no: i+1,
        selected_id: i-1
      }

    inputFormData(encodeFormData(person_metadata));

    }

    //defines funding agency fetch body and sends (need a better ISO field)
    var funding_agency_metadata = {
      submission_no: submission_no,
      csrf_token: csrf_token,
      action: 'save',
      type: 'funding_agency',
      row_no: '1',
      value: window.prompt('Optional: please enter the funding agency...'),
      selected_id: '-1'
    }

    inputFormData(encodeFormData(funding_agency_metadata));


    //defines related projects/programs fetch body and sends (need a better ISO field)
    var related_program_metadata = {
      submission_no: submission_no,
      csrf_token: csrf_token,
      action: 'save',
      type: 'project',
      row_no: '1',
      value: window.prompt('Optional: please enter the related project or program...'),
      selected_id: '-1'
    }

    inputFormData(encodeFormData(related_program_metadata));

    //page 2: dates & locations
    //maps the form fields to ISO metadata fields
    var dates_locations_fields = {
      'start_date': time_range.start.year + "-" + padDatePart(time_range.start.month) + "-" + padDatePart(time_range.start.day),
      'end_date': time_range.end.year + "-" + padDatePart(time_range.end.month) + "-" + padDatePart(time_range.end.day),
      'n_boundary': padDeg(spatial_extent.bounding_box[0].n),
      's_boundary': padDeg(spatial_extent.bounding_box[0].s),
      'e_boundary': padDeg(spatial_extent.bounding_box[0].e),
      'w_boundary': padDeg(spatial_extent.bounding_box[0].w)
    }

    //loops through form fields, defines dates & locations fetch body and sends
    for (i in dates_locations_fields) {
      var dates_locations_metadata = {
        action: 'save',
        type: 'column',
        column_name: i,
        value: dates_locations_fields[i],
      submission_no: submission_no,
      csrf_token: csrf_token
      }

    inputFormData(encodeFormData(dates_locations_metadata));

    }

    //maps form fields to ISO fields (need to find better ISO field for platform)
    var platform_fields = {
      'platform': window.prompt('Optional: please enter the platform name...'),
      'sea_name': spatial_extent.spatial_description
    }

    //defines fetch body for platform field & sea name and sends
    for (i in platform_fields) {
      var platform_metadata = {
        submission_no: submission_no,
        csrf_token: csrf_token,
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
    for (i in data_tables) {
      for (j in data_tables[i].attributes) {

        var parameter = data_tables[i].attributes[j].attribute_basics.code_name;

        if (confirm("Input " + parameter + "?")) {

        if (data_tables[i].attributes[j].attribute_basics.units != undefined) {
          var units = data_tables[i].attributes[j].attribute_basics.units.unit;
        } else {
            var units = window.prompt('Required: please enter units...');
          };

        var parameter_metadata = {
          submission_no: submission_no,
          csrf_token: csrf_token,
          data_type: parameter,
          obs_type: window.prompt('Required: please enter the observation category (e.g., in situ)...'),
          sampling_instrument: window.prompt('Required: please enter the sampling instrument (e.g., CTD)...'),
          sna_method: window.prompt('Optional: please enter the sampling & analyzing method...'),
          data_quality_info: window.prompt('Optional: please enter the data quality method...'),
          unit: units,
          MorC: window.prompt('Required: please enter "M" for measured or "C" for calculated...'),
          action: 'save',
          type: 'data_type',
          row_no: '1',
          selected_id: '-1',
          obs_type_id: '-1',
          sampling_instrument_id: '34' 
        }
      
      
        
        inputFormData(encodeFormData(parameter_metadata));

        }

      }

    }

    //page 4: package description
    //maps form fields to ISO metadata
    var package_fields = {
      'recommended_title': 'N',
      'title': metadata.metadata.values.description.title,
      'abstract': metadata.metadata.values.description.abstract,
      'author_list': citation_contacts.map(c=>c.person.last_name + ", " + c.person.first_name).join('; '),
      'purpose': metadata.metadata.values.description.purpose,
      'reference': window.prompt('Optional: please enter a reference...')
    }

    //loops through form fields to send values via fetch
    for (i in package_fields) {
      var package_metadata = {
        action: 'save',
        type: 'column',
        column_name: i,
        value: package_fields[i],
        submission_no: submission_no,
        csrf_token: csrf_token
      }

    inputFormData(encodeFormData(package_metadata));

    }

});
