
//var metadata_url = navigator.clipboard.readText()
//var metadata_url = window.prompt("Enter the URL of your metadata record: ");
//alert("Your name is " + name);
//var metadata_url = "https://researchworkspace.com/api/metadata/objectfull/5edfcc9c24aa9a002fe0971c?uid=1829643&&lock=true"
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
        var contact_field = document.forms[1]['first_input']
        if(typeof(contact_field) != 'undefined' && contact_field != null){
            for (var i in contacts) {
                $('input[name="firstname"]').val(contacts[i].person.first_name);
                $('input[name="lastname"]').val(contacts[i].person.last_name);
                $('input[name="suffix"]').val(roleMap[contacts[i].role]);
                $('input[name="email"]').val(contacts[i].address.email);
                $('input[name="institution"]').val(contacts[i].position.organization);

                saveInput['person'];
                //$('.persons > button').click();


                //if(i != 0) {
                //$(document.getElementById("addAnotherperson").click());
               // }

              
            }    
        }
        else {console.log("poop13")
        }

        //insert funding agency
        var field = document.forms[2]['funding_agency_input']
        if(typeof(field) != 'undefined' && field != null) {
            $('input[name="funding_agency_input"]').val(funding_agency);
            saveInput('funding_agency');
        }

        //insert related projects and/or programs
        var field = document.forms[3]['project_input']
        if(typeof(field) != 'undefined' && field != null) {
            $('input[name="project_input"]').val(project_program);
            saveInput('project');
        }
})

//localStorage.clear()

