var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render(res.locals.render_file + 'index', {
        hide_header: true
    });
});

export default router;
