//var metadata_url = window.prompt("Enter the URL of your metadata record: ");
var metadata_url = "https://researchworkspace.com/files/6472827/metadata.json"

$.getJSON(metadata_url)
    .then(metadata => {

        //helpful functions
        const padDeg = (deg,padLen) => {
            padLen = padLen || 4;
            return Number(deg).toFixed(padLen);
        }

        const padDatePart = (val,expLen)=>{
            expLen = expLen || 2;
            let str = String(val)
            let missingPad = expLen - str.length;
            if(missingPad > 0){
                str = new Array(missingPad).fill('0').join('') + str;
            }
            return str;
        }

        //VARS PAGE 1
        var values = metadata.metadata.values;
        var contacts = values.contacts.citation_contacts;
        var roleMap = {
                author:'principal investigator',
                originator:'primary point of contact',
                owner:'principal investigator',
                principalInvestigator:'principal investigator',
        }
        var funding_agency = values.contacts.credits[0];
        var project_program = values.contacts.credits[1];

        //VARS PAGE 2
        var time_range = values.time_period.coverage[0].range;
        var start_date = time_range.start.year + "-" + padDatePart(time_range.start.month) + "-" + padDatePart(time_range.start.day);
        var end_date = time_range.end.year + "-" + padDatePart(time_range.end.month) + "-" + padDatePart(time_range.end.day);
        var north_boundary = padDeg(values.spatial.bounds_and_description.bounding_box[0].n);
        var south_boundary = padDeg(values.spatial.bounds_and_description.bounding_box[0].s);
        var east_boundary = padDeg(values.spatial.bounds_and_description.bounding_box[0].e);
        var west_boundary = padDeg(values.spatial.bounds_and_description.bounding_box[0].w);
        var platform = values.contacts.credits[2];
        var sea_name = values.spatial.bounds_and_description.spatial_description;

        //VARS PAGE 3
        var parameter = values.contacts.credits[5];
        var measured_or_calculated = values.contacts.credits[6];
        var units = values.contacts.credits[7];
        var observation_category = values.contacts.credits[8];
        var sampling_instrument = values.contacts.credits[9];
        var sampling_method = values.contacts.credits[10];
        var data_quality_method = values.contacts.credits[11];

        //VARS PAGE 4
        var dataset_title = values.description.title;
        var abstract = values.description.abstract;
        var dataset_author_list = ""
        for(var i in contacts) {
            dataset_author_list = dataset_author_list
             + contacts[i].person.last_name
              + ", " + contacts[i].person.first_name
              if (i != contacts.length-1) {
                  dataset_author_list = dataset_author_list + "; "
              }
        };
        var purpose = values.description.purpose;
        var reference = dataset_author_list + ". " + dataset_title + ". " + "Dataset. Research Workspace.";

        //FORM PAGE 1
        
        function input_contacts(){
            for (var i in contacts) {

                if(i == 0) {

                    $('input[name="firstname"]').val(contacts[i].person.first_name);
                    $('input[name="lastname"]').val(contacts[i].person.last_name);
                    $('input[name="suffix"]').val(roleMap[contacts[i].role]);
                    $('input[name="email"]').val(contacts[i].address.email);
                    $('input[name="institution"]').val(contacts[i].position.organization);

                    console.log("clicking person button");
                    $('.persons > button').click();

                } else {
                    setTimeout( function() {

                    console.log("hitting add new button");
                    editInput('person', 'N', null);
                    $('input[name="firstname"]').val(contacts[i].person.first_name);
                    $('input[name="lastname"]').val(contacts[i].person.last_name);
                    $('input[name="suffix"]').val(roleMap[contacts[i].role]);
                    $('input[name="email"]').val(contacts[i].address.email);
                    $('input[name="institution"]').val(contacts[i].position.organization);

                    console.log("clicking save person button... again");
                    $('.persons > button').click();
                    
                    }, 4000 * i)
                }

            }
        }
        function input_funders(){

                $('input#funding_agency_input').val(funding_agency);

                console.log("clicking funder button")
                saveInput('funding_agency');
            }

        function input_projects(){

                $('input#project_input').val(project_program);

                console.log("clicking project button")
                saveInput('project');
        }

        //FORM PAGE 2

        function input_dates(){

                 $('input[name="startdate"]').val(start_date);
                 $('input[name="enddate"]').val(end_date);

                 console.log("entering dates")
        }

        function input_location(){

                 $('input#n_boundary').val(north_boundary);
                 $('input[name="sb"]').val(south_boundary);
                 $('input[name="eb"]').val(east_boundary);
                 $('input[name="wb"]').val(west_boundary);

                 console.log("entering location boundaries")
        }

        function input_platform(){

                 $('input#platform_input').val(platform);

                 console.log("clicking platform button")
                 saveInput('platform');
        }

        function input_seaname(){

                 $('input#sea_name_input').val(sea_name);

                 console.log("clicking region button")
                 saveInput('sea_name');

        }

        //FORM PAGE 3

        function input_datatypes(){

                 $('input#data_type_input').val(parameter);
                 $('input[name="MorC"]').val("M");
                 $('input#unit_input').val(units);
                 $('input#obs_category_input').val(observation_category);
                 $('input#si_input').val(sampling_instrument);
                 $('input#sna_method_input').val(sampling_method);
                 $('input#dqi_input').val(data_quality_method);

                 console.log("clicking data type button")
                 saveInput('data_type');
        }

        //FORM PAGE 4

        function input_packagedescription(){

                 $('textarea#title').disabled=false;
                 $('textarea#title').val(dataset_title);
                 $('textarea#abstract').val(abstract);
                 $('textarea#author_list').val(dataset_author_list);
                 $('textarea#purpose').val(purpose);
                 $('textarea#reference').val(reference);

                 console.log("entering package description")
        }

        //PAGE 5: upload & submit
        //$('input[id="file_input_1"').val();//can be link to RW file? prompt user for link?


//check for input then call appropriate function(s) for the page
if($('#first_input').length) {

    console.log("we are on page 1")
    //run page 1
    input_contacts();
    setTimeout(input_funders, 6000 * contacts.length);
    setTimeout(input_projects, 8000 * contacts.length);

    } else if ($('#start_date').length) {
    
      console.log("we are on page 2")
      //run page 2
      input_dates();
      input_location();
      setTimeout(input_platform, 2000);
      setTimeout(input_seaname, 4000);

        } else if ($('#data_type_input').length) {
      
          console.log("we are on page 3")
          //run page 3
          input_datatypes();

            } else if ($('textarea#title')) {

            console.log("we are on page 4")
            //run page 4
            //input_packagedescription();

}

})


