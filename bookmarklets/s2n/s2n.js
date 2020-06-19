//var metadata_url = window.prompt("Enter the URL of your metadata record: ");
var metadata_url = "https://researchworkspace.com/files/6472827/metadata.json"

$.getJSON(metadata_url)
    .then(metadata => {

        //VARS PAGE 1
        var values = metadata.metadata.values;
        var contacts = values.contacts.citation_contacts;//loop for multiples
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
        var start_date = time_range.start.year + "-" + time_range.start.month + "-" + time_range.start.day;
        var end_date = time_range.end.year + "-" + time_range.end.month + "-" + time_range.end.day;
        var north_boundary = values.spatial.bounds_and_description.bounding_box.n;
        var south_boundary = values.spatial.bounds_and_description.bounding_box.s;
        var east_boundary = values.spatial.bounds_and_description.bounding_box.e;
        var west_boundary = values.spatial.bounds_and_description.bounding_box.w;
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
        var dataset_author_list = contacts[0].person.last_name + ", " + contacts[0].person.first_name;//loop for multiples
        var purpose = values.description.purpose;
        var reference = dataset_author_list + ". " + dataset_title + ". " + "Dataset. Research Workspace.";


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
                    $('input[id="firstLink"]').val(platform);
                        saveInput();
                }
        }

        function input_seaname(){
                var field = $('#')
                if(field.length) {
                    $('input[id="secondLink"]'.val(sea_name);
                        saveInput();
                }
        }

        //FORM PAGE 3

        function input_datatypes(){
                var field = $('#')
                if(field.length) {
                    $('input[id="data_type_edit_1"]').val(parameter);
                    $('input[id="MorC_1"]').val(measured_or_calculated);
                    $('input[id="unit_1"]').val(units);
                    $('input[id="obs_type_1"]').val(observation_category);
                    $('input[id="si_1"]').val(sampling_instrument);
                    $('input[id="sna_method_1"]').val(sampling_method);
                    $('input[id="dqi_1"]').val(data_quality_method);
                        saveInput();
                }
        }

        //FORM PAGE 4

        function input_packagedescription(){
                var field = $('#')
                if(field.length) {
                    $('input[id="title"]').val(dataset_title);
                    $('input[id="abstract"]').val(abstract);
                    $('input[id="author_list"]').val(dataset_author_list);
                    $('input[id="purpose"]').val(purpose);
                    $('input[id="reference"]').val(reference);
                        saveInput();
                }
        }

        //PAGE 5: upload & submit
                    //$('input[id="file_input_1"').val();//can be link to RW file? prompt user for link?


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


