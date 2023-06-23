/**
 * JavaScript to build and handle the notes page
 */
import { firstDiv, nav, main} from "./htmlElements.js";
import { cursorPositionInContentEditableDiv } from "./contentEditableDiv.js";
import { sendPostRequestToServer } from "./postRequest.js";
import { saveNoteToLeftSide } from "./saveNotesToleft.js";
import { deleteRequestFunction } from "./deleteRequest.js";
const deleteRequest = deleteRequestFunction;
const postRequest = sendPostRequestToServer;

// handles the save button
const toggleSaveButton = (element1, saveButton, element2) => {
    if(element1.text() === 'Note Title;' || element1.text() === "*" || element1.text() === "" ){
        $(saveButton).hide();
    }else{
        $(saveButton).show();
        // remove event handlers that were bound to the element to avoid extra data
        $(saveButton).off('click');
        //$(saveButton).off('keyup');
        saveTargets(saveButton, element1, element2)
    }
};
// makes an object, then sends the object to the server, then the server will send to database
const saveTargets = (saveButton, target1, target2) => {
    // make the callback function async in order to await the data
    $(saveButton).on('click', async function(){
        // get the data from the targets
        const data = {
            title: target1.text(),
            text: target2.text(),
        }
       const response = await postRequest('/api/notes', JSON.stringify(data))
       console.log('post request: ',response)
       saveNoteToLeftSide(response)
       deleteNote()

    })
}
// handles clearing notepad
const clearNote = (buttonClicked, target1, target2, toggleButton) => {
    buttonClicked.on('click', function(){
        target1.text('Note Title;');
        target2.text('Note Text');
        toggleSaveButton(target1, toggleButton, target2)
    });
};
// handles deleting notes
const deleteNote = () => {
    let deleteBtn = $('.delete');
    deleteBtn.on('click', deleteBtn, async function(event){
        // target the button
        let tempElement = $(event.target).closest('button')
        console.log(event.target)
        // get the dataID you attached previously
        let dataID = tempElement.data('noteid')
        //sending delete request to server when button clicked make sure this is wraped in {}
        let statusCode = await deleteRequest('/api/notes', JSON.stringify({dataID}))
        // remove the div on 200 status
        if(statusCode === 200){
            let removeDiv = tempElement.closest('div')
            removeDiv.remove()
        }
    })
}
// persists the data from the backend
const callPersistantData = async (url) => {
    try{
        const response = await axios(url,{
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            }})
        //console.log(response)
        if (response.status == 200){
            const jsonArray = response.data
            const rf = (array) =>{
                if(array.length < 1){
                    return array
                }
                let smallArray = array.splice(array.length-1,1)
                rf(array)
                let fromCallStack = smallArray.pop()
                saveNoteToLeftSide(fromCallStack)
            }
            rf(jsonArray)
        }
    }catch(error){
        console.error({Message: "Error: ", Error: error})
    }finally{
        deleteNote()
    }
}

const init = () => {
    callPersistantData('/api/json')
    $("body").append(firstDiv);
    firstDiv.append(nav);
    main.insertAfter(nav)
    
    const noteTitle= $('.noteTitle');
    const noteText = $('.noteText');
    const saveButton = $('.saveButton');
    const makeNewNote = $('.newNote');

    toggleSaveButton(noteTitle, saveButton, noteText);
    clearNote(makeNewNote, noteTitle, noteText, saveButton);
    // must use even delegation
    $(document).on('keyup', noteTitle, function() {
        toggleSaveButton(noteTitle, saveButton, noteText);
    });
    saveTargets(saveButton, noteTitle, noteText)
    cursorPositionInContentEditableDiv(noteTitle, noteText)
};

$(document).ready(init);


