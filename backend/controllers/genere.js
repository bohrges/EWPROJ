const mongoose = require("mongoose");
const Genere = require("../models/genere"); // Ensure the correct path to your model file

module.exports.list = () => {
    return Genere
        .find() // Retrieves all documents from the 'generes' collection
        .sort({_id : 1}) // Sorts the results by the 'nome' field in ascending order
        .exec(); // Executes the query
};

/*
module.exports.listModalidades = () => {
    return Genere
    .distinct('desportos')
    .exec();
}

module.exports.findById = id => {
    return Genere
        .findOne({_id : id}) // Finds a single document by its MongoDB ObjectID
        .exec(); // Executes the query
};

module.exports.insert = genere => {
        return Genere.create(genere); // Inserts a new document into the 'generes' collection
};

module.exports.updateGenere = (id, genere) => {
    return Genere.updateOne({_id : id}, genere); // Updates an existing document in the 'generes' collection
};

module.exports.removeById = id => {
    return Genere.deleteOne({_id: id});
}

module.exports.update = (id, genere) => {
    return Genere.findByIdAndUpdate(id, genere);
}

module.exports.findAtletasByModalidade = modalidade => {
    return Genere
        .find({desportos : modalidade}) // Finds all documents that contain the specified 'modalidade' in the 'desportos' array
        .sort({nome : 1}) // Sorts the results by the 'nome' field in ascending order
        // .distinct("_id")
        .exec(); // Executes the query
}

*/

