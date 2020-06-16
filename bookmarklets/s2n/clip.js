
//var metadata_url = navigator.clipboard.readText()
//var metadata_url = window.prompt("Enter the URL of your metadata record: ");
//alert("Your name is " + name);
//var metadata_url = "https://researchworkspace.com/api/metadata/objectfull/5edfcc9c24aa9a002fe0971c?uid=1829643&&lock=true"
 
var metadata_url = "https://researchworkspace.com/files/6472827/metadata.json"

$.getJSON(metadata_url)
    .then(metadata => {
        var contacts = metadata.metadata.values.contacts
        console.log(contacts.points_of_contact[0]['person']['last_name'])

        //if ($('input[name="firstname"]').length) {
        //    alert("Yes!");
        //} else { alert("Nope!")
        //}

    })


