/**
 * JavaScript to build and handle the notes page
 */

// First you need to load all elements onto the page
let nav = $(`<nav class="bg-blue-300 p-2 flex justify-between items-center">
<div class="text-white">Notes</div>
<div>
  <button class="saveButton p-2 rounded mr-2">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6 hover:text-yellow-700">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width=".75" d="M13 3h2.996v5h-2.996v-5zm11 1v20h-24v-24h20l4 4zm-17 5h10v-7h-10v7zm15-4.171l-2.828-2.829h-.172v9h-14v-9h-3v20h20v-17.171zm-3 10.171h-14v1h14v-1zm0 2h-14v1h14v-1zm0 2h-14v1h14v-1z"></path>
    </svg>
  </button>
  <button class="newNote p-2 rounded hover:text-yellow-700" title="Create a new note.">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 3v7m0 0v7m0-7H7m7 0h7"></path>
    </svg>
  </button>
</div>
</nav>`);
let main = $(`<main class="flex">
<aside class="border-r-2 border-gray-300 my-1 mx-4 w-1/3 ">
  <div id="savedNotes" class="flex-col shadow mr-3">
    <div class="flex items-center justify-between border-b-2 border-gray-300">
    </div>
  </div>
</aside>
<div id="notesContainer" class="w-2/3">
  <div class="stacked-input flex-col" contenteditable="true">
    <div class="noteTitle text-gray-400 text-5xl py-1">Note Title;</div>
    <div class="noteText text-gray-400">Note Text</div>
  </div>
</div> 
</main>`)
let newNote = $(`
<div class="flex items-center justify-between border-b-2 border-gray-300">
<div class="inline-block align-middle pl-2">some notes that I took and saved</div>
<button class="p-2 rounded">
  <svg class="fill-current h-6 text-red-400 hover:text-red-700" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
    <path d="M9 3h6v-1.75c0-.066-.026-.13-.073-.177-.047-.047-.111-.073-.177-.073h-5.5c-.066 0-.13.026-.177.073-.047.047-.073.111-.073.177v1.75zm11 1h-16v18c0 .552.448 1 1 1h14c.552 0 1-.448 1-1v-18zm-10 3.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v12c0 .276.224.5.5.5s.5-.224.5-.5v-12zm5 0c0-.276-.224-.5-.5-.5s-.5.224-.5.5v12c0 .276.224.5.5.5s.5-.224.5-.5v-12zm8-4.5v1h-2v18c0 1.105-.895 2-2 2h-14c-1.105 0-2-.895-2-2v-18h-2v-1h7v-2c0-.552.448-1 1-1h6c.552 0 1 .448 1 1v2h7z"/>
  </svg>
</button>`)

// you still need to make the "newNote" button work.
const toggleSaveButton = (checkedElement, changedElement) => {
    if(checkedElement.text() === 'Note Title;'){
        $(changedElement).hide();
    }else{
        $(changedElement).show();
        // remove event handlers that were bound to the element to avoid extra data
        $(changedElement).off('click');
        // add event handler to save button to send its content to server
        $(changedElement).on('click', function(event){
            
            // checkedElement.text()
            // dataElement.text()
            // event bubbling is happening
            
            console.log(checkedElement.text())
            console.log($('.noteText').text())
        })
    }
};
const clearNote = (buttonClicked, target1, target2, toggleButton) => {
    buttonClicked.on('click', function(){
        target1.text('Note Title;');
        target2.text('Note Text');
        toggleSaveButton(target1, toggleButton)
    });
};
const init = () => {
    let firstDiv = $(`<div class="border-2 border-black p-1 flex-col h-2/3"></div>`);
    $("body").append(firstDiv);
    firstDiv.append(nav);
    main.insertAfter(nav)
    
    const noteTitle= $('.noteTitle');
    const noteText = $('.noteText');
    const saveButton = $('.saveButton');
    const makeNewNote = $('.newNote');

    toggleSaveButton(noteTitle, saveButton);
    clearNote(makeNewNote, noteTitle, noteText, saveButton);
      // must use even delegation
    $(document).on('keyup', noteTitle, function(event) {
        
        toggleSaveButton(noteTitle, saveButton);
    });
    noteTitle.on('click',function(event){
        
        if($(this).text() === "Note Title;"){
            $(this).text('*')
        }else{
            return;
        }
    })
    noteText.on('click',function(event){
        event.stopPropagation()
        if($(this).text() === "Note Text"){
            $(this).text('-')
        }else {
            return;
        }
    })

};

$(document).ready(init);


