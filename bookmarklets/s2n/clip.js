var metadata_url = "https://researchworkspace.com/files/6472827/metadata.json"

$.getJSON(metadata_url)
    .then(metadata => {

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
        var start_date = values.time_period.coverage.range; //build from JSON
        var end_date = values.time_period.coverage.range; //build from JSON
        var north_boundary = values.spatial.bounds_and_description.bounding_box.n;
        var south_boundary = values.spatial.bounds_and_description.bounding_box.s;
        var east_boundary = values.spatial.bounds_and_description.bounding_box.e;
        var west_boundary = values.spatial.bounds_and_description.bounding_box.w;
        var platform = values.contacts.credits[2];
        var sea_name = values.spatial.bounds_and_description.spatial_description;
        var parameter = values.contacts.credits[5];
        var measured_or_calculated = values.contacts.credits[6];
        var units = values.contacts.credits[7];
        var observation_category = values.contacts.credits[8];
        var sampling_instrument = values.contacts.credits[9];
        var sampling_method = values.contacts.credits[10];
        var data_quality_method = values.contacts.credits[11];


        //FORM PAGE 1

        function input_contacts(){
            //var field = document.forms[1]['first_input']
            var field = $('first_input')
                if(field.length) {
                    for (var i in contacts) {
                        $('input[name="firstname"]').val(contacts[i].person.first_name);
                        $('input[name="lastname"]').val(contacts[i].person.last_name);
                        $('input[name="suffix"]').val(roleMap[contacts[i].role]);
                        $('input[name="email"]').val(contacts[i].address.email);
                        $('input[name="institution"]').val(contacts[i].position.organization);

                        $('.persons > button').click();
                    }    
                }
        }

        function input_funders(){
                //var field = document.forms[2]['funding_agency_input']
            var field = $('#funding_agency_input')
                if(field.length) {
                        field.val(funding_agency);
                        saveInput('funding_agency');
                }
        }

        function input_projects(){
                var field = $('#project_input')
                if(field.length) {
                    field.val(project_program);
                        saveInput('project');
                }
        }

        //FORM PAGE 2

        function input_dates(){
                var field = $('#')
                if(field.length) {
                    $('input[name="startdate"]').val(start_date);
                    $('input[name="enddate"]').val(end_date);
                        //saveInput();
                }
        }

        function input_location(){
                var field = $('#')
                if(field.length) {
                    $('input[name="nb"]').val(north_boundary);
                    $('input[name="sb"]').val(south_boundary);
                    $('input[name="eb"]').val(east_boundary);
                    $('input[name="wb"]').val(west_boundary);
                        //saveInput();
                }
        }

        function input_platform(){
                var field = $('#')
                if(field.length) {
                    field.val(platform);
                        saveInput();
                }
        }

        function input_seaname(){
                var field = $('#')
                if(field.length) {
                    $('input[id="sea_name_input_1"]'.val(sea_name);
                        saveInput();
                }
        }

        //FORM PAGE 3

        function input_datatypes(){
                var field = $('#')
                if(field.length) {
                    $('input[id="sea_name_input_1"]'.val(sea_name)
                        saveInput();
                }
        }

        //FORM PAGE 4

        function input_packagedescription(){
                var field = $('#')
                if(field.length) {
                    field.val();
                        saveInput();
                }
        }

//run page 1
input_contacts();
setTimeout(input_funders, 2000);
setTimeout(input_projects, 4000);

//run page 2

//input_dates();
//setTimeout(input_location, 2000);
//setTimeout(input_platform, 4000);
//setTimeout(input_seaname, 6000);

//run page 3

//input_datatypes();

//run page 4

//input_packagedescription():

})

