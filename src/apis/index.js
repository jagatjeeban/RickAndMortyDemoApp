//import axios instance
import { instance } from "../common/apiService";

//import config
import config from "../common/config";

//function to get characters from api
export const getCharactersGetAPI = (params) => {
    return instance('GET', config.BASE_URL+params);
};