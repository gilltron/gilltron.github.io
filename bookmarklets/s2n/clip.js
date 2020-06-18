var metadata_url = "https://researchworkspace.com/files/6472827/metadata.json"



$.getJSON(metadata_url)
    .then(metadata => {

        // define some higher level variables
        var values = metadata.metadata.values;
        var contacts = values.contacts.citation_contacts;
        var roleMap = {
                principalInvestigator:'principal investigator',
                originator:'primary point of contact'
            }
        var funding_agency = values.contacts.credits[0];
        var project_program = values.contacts.credits[1];

        // insert contacts
        function deez_contacts(){
        var contact_field = document.forms[1]['first_input']
        if(typeof(contact_field) != 'undefined' && contact_field != null){
            for (var i in contacts) {
                $('input[name="firstname"]').val(contacts[i].person.first_name);
                $('input[name="lastname"]').val(contacts[i].person.last_name);
                $('input[name="suffix"]').val(roleMap[contacts[i].role]);
                $('input[name="email"]').val(contacts[i].address.email);
                $('input[name="institution"]').val(contacts[i].position.organization);

                //setTimeout(function after2seconds(){
                        //saveInput['person'];
                $('.persons > button').click();
                //}, 2000)
                //$('.persons > button').click();


                //if(i != 0) {
                //$(document.getElementById("addAnotherperson").click());
               // }
            }    
        }
        }
        //insert funding agency
        function deez_funders(){
                var field = document.forms[2]['funding_agency_input']
                if(typeof(field) != 'undefined' && field != null) {
                        $('input[name="funding_agency_input"]').val(funding_agency);
                        saveInput('funding_agency');
                        console.log('funders')
        }
        }

        //insert related projects and/or programs
        function deez_projects(){
                var field = $('#project_input')
                if(field.length) {
                        
                    field.val(project_program);
                        saveInput('project');
                        
                } else {
                        console.log("you fucked up")
                  }
        console.log('projects')
        }


deez_contacts();
setTimeout(deez_funders, 2000);
setTimeout(deez_projects, 4000);

})

//localStorage.clear()
