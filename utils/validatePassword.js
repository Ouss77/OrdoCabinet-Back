function validatePassword(password){
    if (password !== null )   return password.length >= 6;
            
    return false;
}

module.exports = { validatePassword};