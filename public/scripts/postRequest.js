/**
 * JavaScript to send a post request and handle errors
 */

const sendPostRequestToServer = async (url, data) => {
    try{
        const response = await fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if(response.ok){
            const data = await response.json();
            return data;
        }else{
            console.error('Failed to save note:')
        }
    }catch(error){
    console.error({Message: 'Failed to save note: ', Error: error})
    }
}

export {sendPostRequestToServer}