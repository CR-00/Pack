const convertCamelCase = (str) => {
    return str.replace(/([A-Z])/g, (match) => ` ${match.toLowerCase()}`);
};

export default convertCamelCase;