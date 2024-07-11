const Diary = require('../models/dairy.js');

function getAllUserDocs(req) 
{
    return Diary.find({user: req.user._id}).populate("user","title document date");
}

module.exports = {
    getAllUserDocs
}
