module.exports = {
    name: "logout",
    method: "GET",
    execute(params, req) {
        req.session.Email = undefined;
    }
};