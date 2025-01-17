const router = require("express").Router();
const passport = require("passport");

// auth login
router.get("/login", (req, res) => {
    res.render("login", { authenticated: req.isAuthenticated(), user: req.session.user });
});

// auth logout
router.get("/logout", (req, res) => {
    // req.session = null;
    req.logout();
    req.session.user = null;
    res.redirect("/");
});

// auth with google+
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/error" }),
    function (req, res) {
        // console.log('req.user') // user info
        // Successful authentication, redirect success.
        if (process.env.NODE_ENV == "development") {
            // console.log("dev = ", req.headers.host);
            // console.log("dev url = ", req.url);
            res.redirect("/profile");
        } else if (process.env.NODE_ENV == "production") {
            res.redirect(`https://${req.headers.host}/profile`);
        } else {
            res.redirect("/profile");
        }
    }
);

module.exports = router;
