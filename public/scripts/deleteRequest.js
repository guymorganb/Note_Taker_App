/**
 * JavaScript Delete request
 */

const deleteRequestFunction = async (url, data) =>{
    try{
        const response = await fetch(url,{
            method: 'DELETE',
            body: data,
            headers:{
                'Content-type': 'application/json', 
            }
        })
        if(response.status === 200){
            await response.json()
            return response.status
        }else{
            console.error('Delete request failure', response.status)
        }
    }catch(error){
        console.error({message: 'Server error: ', Error: error})
    }
}

export {deleteRequestFunction}