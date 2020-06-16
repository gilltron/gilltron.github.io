
//var metadata_url = navigator.clipboard.readText()
//var metadata_url = window.prompt("Enter the URL of your metadata record: ");
//alert("Your name is " + name);
//var metadata_url = "https://researchworkspace.com/api/metadata/objectfull/5edfcc9c24aa9a002fe0971c?uid=1829643&&lock=true"
 
var metadata_url = "https://researchworkspace.com/files/6472827/metadata.json"

$.getJSON(metadata_url)
    .then(metadata => {
        var contacts = metadata.metadata.values.contacts.citation_contacts
        var contact_field = document.forms[1]['first_input']
        if(typeof(contact_field) != 'undefined' && contact_field != null){
            for (var i in contacts) {
                console.log(contacts[i].person)
            }    
        }
        else {console.log("poop13")}
    })


