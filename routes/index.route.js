const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("layouts/home", {
        name: req.user[0].dataValues.name
    });
})


module.exports = router;