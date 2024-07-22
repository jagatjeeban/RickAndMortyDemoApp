//function to get the string with its first letter in uppercase
export const getFirstLetterUc = (str) => {
    if(!str || str === '') return str;
    return str?.charAt(0)?.toUpperCase() + str.substring(1, str?.length);
}

//funtion to validate the string
export const validateString = (str) => {
    if(!str || str === '') return '---';
    return str;
}

//function to get the id from url
export const getIdFromUrl = (url) => {
    const parts = url.split('/');
    const number = parseInt(parts[parts.length - 1], 10);
    return number;
}