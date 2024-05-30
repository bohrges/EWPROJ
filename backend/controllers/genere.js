const mongoose = require("mongoose");
const Genere = require("../models/genere"); // Ensure the correct path to your model file

// Return a promise that resolves with both totalCount and the paginated results
module.exports.getGeneresPaginated = (page, limit) => {
    const skip = page * limit;
    return Genere.countDocuments()
        .then(totalCount => 
            Genere.find()
                .sort({_id: 1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
};

module.exports.findByName = name => {
    return Genere
        .find({UnitTitle : name}) // Finds all documents that contain the specified 'name' in the 'nome' field
        .sort({UnitTitle : 1}) // Sorts the results by the 'nome' field in ascending order
        .exec(); // Executes the query
}

module.exports.findByPlace = place => {
    return Genere
        .find({local : place}) // Finds all documents that contain the specified 'place' in the 'local' field
        .sort({nome : 1}) // Sorts the results by the 'nome' field in ascending order
        .exec(); // Executes the query
}

module.exports.findByDate = date => {
    return Genere
        .find({data : date}) // Finds all documents that contain the specified 'date' in the 'data' field
        .sort({nome : 1}) // Sorts the results by the 'nome' field in ascending order
        .exec(); // Executes the query
}

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


