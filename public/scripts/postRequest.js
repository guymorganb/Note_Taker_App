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
        console.log(response)
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

// const sendPostRequestToServer = async (url, data) => {
//     // wrap the entire function in a promise so I can get the response data
//     return new Promise((resolve, reject) => {
//     // first fetch the api using a post request and Try/Catch
//         axios({
//             method: 'post',
//             url: `${url}`,
//             data: data,
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         }).then((response) => {
//             if(response.status === 200){
//                 console.log("Save Sucessful")
//                 resolve(response.data)  // send back the data
//             }else{
//                 console.error('Failed to save note: ', response.status)
//             }
//         }).catch((error) => {
//             if(error.response){
//                 console.error('"Error saving note. Status: ', error.response.status)
//             }else{
//                 console.error('Error saving note:', error.response.staus)
//             }
//         })
//     })
// }
