module.exports = {
    sessionControl(req, res, next ) {
        function isCCRequest(req) {
            const CC_SECRET = 'MY_CC_SECRET';
            return req.headers['x-cc-token'] === CC_SECRET;
        }

        if (req.session.login != undefined ) next();
        
        else if ((req.url == '/') && (req.method == 'GET')) next() ;
        else if ((req.url == '/login') && ( req . method == 'POST')) next();
        else if ((req.url).split( '/')[1] == 'recuperarSenha') next();
        else if ((req.url == '/updateChest') && isCCRequest(req)) next();
        else res.redirect('/');
    }
};