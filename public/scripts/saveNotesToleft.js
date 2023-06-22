/**
 * Saves user notes to the page
 */
import { newNote } from "./htmlElements.js";

const saveNoteToLeftSide = (response) =>{
    console.log('where we want ', response)
    // pass the note id ad a data attribute to the button
    // run the fetch and once it returns ok delete the <div>
    // use the filter array method to filter the db.json
    let title = response.title
    console.log(title)
    let text = response.text
    let noteID = response.noteID
    const addNote = newNote(title, text, noteID)
    if($('#savedNotes').children().length === 0){
        $('#savedNotes').append(addNote)
    }else{
        $('#savedNotes').children(':last-child').after(addNote)
    }
}

export {saveNoteToLeftSide}