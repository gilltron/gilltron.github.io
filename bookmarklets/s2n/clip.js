
//var metadata_url = navigator.clipboard.readText()
//var metadata_url = window.prompt("Enter the URL of your metadata record: ");
//alert("Your name is " + name);
//var metadata_url = "https://researchworkspace.com/api/metadata/objectfull/5edfcc9c24aa9a002fe0971c?uid=1829643&&lock=true"
var metadata_url = "https://researchworkspace.com/files/6472827/metadata.json"

$.getJSON(metadata_url)
    .then(metadata => {
        var contacts = metadata.metadata.values.contacts.citation_contacts
        var roleMap = {
                principalInvestigator:'principal investigator',
                originator:'primary point of contact'
            }
        var contact_field = document.forms[1]['first_input']
        if(typeof(contact_field) != 'undefined' && contact_field != null){
            for (var i in contacts) {
                $('input[name="firstname"]').val(contacts[i].person.first_name);
                $('input[name="lastname"]').val(contacts[i].person.last_name);
                $('input[name="suffix"]').val(roleMap[contacts[i].role]);
                $('input[name="email"]').val(contacts[i].address.email);
                $('input[name="institution"]').val(contacts[i].position.organization);

                $('.persons > button').click();
                //$('.addAnotherperson > button').click();
                $(document.getElementById("addAnotherperson").click());

                //$('input[name="firstname"]').val(citation.person.first_name);
                //$('input[name="lastname"]').val(citation.person.last_name);
                //$('input[name="email"]').val(citation.address.email);
                //$('input[name="suffix"]').val(roleMap[citation.role]);
                //$('input[name="institution"]').val(citation.position.organization);
            }    
        }
        else {console.log("poop13")}
    })

//XMLHttprequesterror

