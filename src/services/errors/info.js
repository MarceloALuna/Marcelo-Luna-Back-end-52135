export const generateUserErrorInfo = user => {
    return  `
    Uno o mas propiedades estan incompletos o son invalidos.
        Lista de propiedades obligatorias:
         - first_name: Must be a string (${user?.first_name})\
         - last_name: Must be a string (${user?.last_name})
         - email: Must be a string (${user?.email})
    `
};

export const generateProductsErrorInfo = (productExist) => {
    return "product not found in BD, please check the code";
};

export const generateCartErrorInfo = (cartExist) => {
    return "cart not found in BD, please check the code";
};