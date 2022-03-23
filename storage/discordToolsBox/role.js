module.exports.hasPermission = (role, element) => {
    return role.permissions.has(element);
}


module.exports.help = {
    name: "role"
};