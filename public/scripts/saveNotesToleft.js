/**
 * Saves user notes to the page
 */
import { newNote } from "./htmlElements.js";

const saveNoteToLeftSide = (response) =>{
    let title = response.title
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