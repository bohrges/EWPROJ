const mongoose = require("mongoose");
const Genere = require("../models/genere"); 

// Presenting 500 records for each page
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

/* ----- SEARCH MOTOR ----- */

// Presenting 500 records for each page, filtered by name
module.exports.findByName = (page, limit, val) => {
    const skip = page * limit;
    console.log("val: " + val);
    const regex = new RegExp(val, 'i');
    return Genere.countDocuments({Name: regex})
        .then(totalCount =>
            Genere.find({Name: regex}) // Not 100% correct !!!
                .sort({_id: 1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
};

// Presenting 500 records for each page, filtered by date
module.exports.findByDate = (page, limit, val) => {
    const skip = page * limit;
    const regex = new RegExp(`${val}-\\d\\d-\\d\\d`, 'i');  
    return Genere.countDocuments({UnitDateFinal: regex})
        .then(totalCount =>
            Genere.find({UnitDateFinal: regex}) 
                .sort({_id: 1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
};

// Presenting 500 records for each page, filtered by location
module.exports.findByLocation = (page, limit, val) => {
    const skip = page * limit;
    const regex = new RegExp(val, 'i');
    console.log("val: " + val);
    return Genere.countDocuments({PhysLoc: regex})
        .then(totalCount =>
            Genere.find({Lugar: regex}) 
                .sort({_id: 1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
};

// Presenting 500 records for each page, filtered by county
module.exports.findByCounty = (page, limit, val) => {
    const skip = page * limit;
    const regex = new RegExp(val, 'i');
    return Genere.countDocuments({Concelho: regex})
        .then(totalCount =>
            Genere.find({Concelho: regex}) 
                .sort({_id: 1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
};

// Presenting 500 records for each page, filtered by district
module.exports.findByDistrict = (page, limit, val) => {
    const skip = page * limit;
    const regex = new RegExp(val, 'i');
    return Genere.countDocuments({Distrito: regex})
        .then(totalCount =>
            Genere.find({Distrito: regex}) 
                .sort({_id: 1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
};

/* ----- SORT MOTOR ----- */

// Presenting 500 records for each page, sorted by name (a-z)
module.exports.sortByName = (page, limit) => {
    const skip = page * limit;
    return Genere.countDocuments() 
        .then(totalCount =>
            Genere.find()
                .collation({ locale: 'pt', strength: 2 }) // case-insensitive
                .sort({Name: 1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
}

// Presenting 500 records for each page, sorted by name (z-a)
module.exports.sortByNameDesc = (page, limit) => {
    const skip = page * limit;
    return Genere.countDocuments() 
        .then(totalCount =>
            Genere.find()
                .collation({ locale: 'pt', strength: 2 })
                .sort({Name: -1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
}

// Presenting 500 records for each page, sorted by date (ascending)
module.exports.sortByDate = (page, limit) => {
    console.log("sortByDate");
    const skip = page * limit;
    return Genere.countDocuments() 
        .then(totalCount =>
            Genere.find()
                .sort({UnitDateFinal: 1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
}

// Presenting 500 records for each page, sorted by date (descending)
module.exports.sortByDateDesc = (page, limit) => {
    const skip = page * limit;
    return Genere.countDocuments() 
        .then(totalCount =>
            Genere.find()
                .sort({UnitDateFinal: -1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
}

// Presenting 500 records for each page, sorted by location (ascending)
module.exports.sortByLocation = (page, limit) => {
    const skip = page * limit;
    return Genere.countDocuments() 
        .then(totalCount =>
            Genere.find()
                .collation({ locale: 'pt', strength: 2 })
                .sort({Lugar: 1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
}

// Presenting 500 records for each page, sorted by location (descending)
module.exports.sortByLocationDesc = (page, limit) => {
    const skip = page * limit;
    return Genere.countDocuments() 
        .then(totalCount =>
            Genere.find()
                .collation({ locale: 'pt', strength: 2 })
                .sort({Lugar: -1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
}

// Presenting 500 records for each page, sorted by county (ascending)
module.exports.sortByCounty = (page, limit) => {
    const skip = page * limit;
    return Genere.countDocuments() 
        .then(totalCount =>
            Genere.find()
                .collation({ locale: 'pt', strength: 2 })
                .sort({Concelho: 1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
}

// Presenting 500 records for each page, sorted by county (descending)
module.exports.sortByCountyDesc = (page, limit) => {
    const skip = page * limit;
    return Genere.countDocuments() 
        .then(totalCount =>
            Genere.find()
                .collation({ locale: 'pt', strength: 2 }) 
                .sort({Concelho: -1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
}

// Presenting 500 records for each page, sorted by district (ascending)
module.exports.sortByDistrict = (page, limit) => {
    const skip = page * limit;
    return Genere.countDocuments() 
        .then(totalCount =>
            Genere.find()
                .collation({ locale: 'pt', strength: 2 }) 
                .sort({Distrito: 1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
}

// Presenting 500 records for each page, sorted by district (descending)
module.exports.sortByDistrictDesc = (page, limit) => {
    const skip = page * limit;
    return Genere.countDocuments() 
        .then(totalCount =>
            Genere.find()
                .collation({ locale: 'pt', strength: 2 })
                .sort({Distrito: -1})
                .limit(limit)
                .skip(skip)
                .then(generes => ({
                    totalCount,
                    generes
                }))
        );
}

// Record by ID
module.exports.findById = id => {
    return Genere
        .findOne({_id : id}) 
        .exec(); 
};

/*
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

