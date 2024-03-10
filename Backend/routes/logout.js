module.exports = {
    name: "logout",
    method: "GET",
    execute(params, req) {
        console.log("Logged out (from logout.js)");
        req.session.Email = undefined;
    }
};