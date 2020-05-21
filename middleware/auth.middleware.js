
const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('warning_flash', 'Please log in first!');
        res.redirect('/');
    }
}

module.exports = auth;