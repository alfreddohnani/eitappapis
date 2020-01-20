const handlers = require('./../handlers');

const router = {
    ''     : handlers.eits,
    'notFound' : handlers.notFound
};



module.exports = router;