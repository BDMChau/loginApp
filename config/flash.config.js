const flash = (req, res, next) => {
    res.locals.success_flash = req.flash('success_flash');
    res.locals.warning_flash = req.flash('warning_flash');
    res.locals.error = req.flash('error'); // error is keyword for passport
    next();
}

module.exports = flash