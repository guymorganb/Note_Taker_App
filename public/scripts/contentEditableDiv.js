/**
 * Manipulates cursor position inside a content editable <div>
 */


const cursorPositionInContentEditableDiv = (div1, div2) => {
    div1.on('click',function(){
        if($(this).text() === "Note Title;"){
            $(this).text('->')
            const element = $(this)[0];
            //creates a new Range object using document.createRange()
            const range = document.createRange();
            //creates a Selection object using window.getSelection()
            const selection = window.getSelection();
            //sets the range to select the entire contents of the <div> element
            range.selectNodeContents(element);
            //collapses the range to the end of the text and adds the range to the selection.
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }else{
            return;
        }
    })
    div2.on('click',function(){
        if($(this).text() === "Note Text"){
            $(this).text(':')
            const element = $(this)[0];
            //creates a new Range object using document.createRange()
            const range = document.createRange();
            //creates a Selection object using window.getSelection()
            const selection = window.getSelection();
            //sets the range to select the entire contents of the <div> element
            range.selectNodeContents(element);
            //collapses the range to the end of the text and adds the range to the selection.
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }else {
            return;
        }
    })
}

export {cursorPositionInContentEditableDiv}