const User = require('../models/User');

module.exports = (req, res, next)=>{ // direkt çalışması için anonim fonksiyon olarak tanımlandı.
    User.findById(req.session.userID, (err, user)=>{
        if(err || !user) return res.redirect('/login');
        next();
    })
}