import axios from "axios";

//function to create a new instance of axios with a custom config
export const instance = async(method = 'GET', baseUrl) => {
    try {
        var header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
        let response = {};
        if(method === 'GET'){
            response = await axios.get(baseUrl, header).then((response) => {
                if(response){
                    let successResponse = {};
                    successResponse.data = response?.data;
                    successResponse.statusCode = response?.status;
                    return successResponse;
                }
                return response?.data;
            })
            .catch((error) => {
                if(error?.response){
                    let errorResponse = {};
                    errorResponse.statusCode = error?.response?.status;
                    errorResponse.errMsg = error?.response?.data;
                    return errorResponse;
                }
            })
        }
        return response;
    } catch (error) {
        return error?.response?.data;
    }
}