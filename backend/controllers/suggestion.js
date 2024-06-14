const mongoose = require("mongoose");
const Suggestion = require("../models/suggestion"); 

// All suggestions
module.exports.getSuggestions = () => {
    console.log("Fetching suggestions ctl..."); 
    return Suggestion.find().exec();
};

// Suggestion by ID
module.exports.findById = id => {
    return Suggestion
        .findOne({_id : id}) 
        .exec(); 
};

// Insert a new suggestion
module.exports.insert = suggestion => {
    return Suggestion.create(suggestion); 
};

// Delete a suggestion by ID
module.exports.removeById = id => {
    return Suggestion.deleteOne({_id: id});
}

// Get the maximum suggestion ID 
module.exports.getMaxId = async () => {
    const maxId = await Suggestion.find({}, {_id: 1}).sort({_id: -1}).limit(1);
    return maxId[0]._id;
}