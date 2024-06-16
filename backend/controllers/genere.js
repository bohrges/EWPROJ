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
    const regex = new RegExp(val, 'i');
    return Genere.countDocuments({Name: regex})
        .then(totalCount =>
            Genere.find({Name: regex}) 
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


// Presenting 500 records for each page, sorted by ID (ascending)
module.exports.sortById = (page, limit) => {
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
}


// Presenting 500 records for each page, sorted by ID (descending)
module.exports.sortByIdDesc = (page, limit) => {
    const skip = page * limit;
    return Genere.countDocuments() 
        .then(totalCount =>
            Genere.find()
                .sort({_id: -1})
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

// Insert a new record
module.exports.insert = genere => {
    return Genere.create(genere); 
};

// Delete a record by ID
module.exports.removeById = id => {
    return Genere.deleteOne({_id: id});
}

// Update a record by ID
module.exports.update = (id, genere) => {
    return Genere.findByIdAndUpdate(id, genere);
}

// Get the maximum inquirição ID 
module.exports.getMaxId = async () => {
    const max_Id = await Genere.find({}, {_id: 1}).sort({_id: -1}).limit(1);
    const maxId = await Genere.aggregate([{ $match: { '﻿ID': { $exists: true, $ne: "" } } }, { $sort: { '﻿ID': -1 } }, { $limit: 1 }, { $project: { _id: 0, ID: '$﻿ID' } }])
    // The weird character is a zero-width space, which is not being recognized by the regex, but should stay there

    return {maxId, max_Id};
}

// Get all inquirição IDs 
module.exports.getAllIds = async () => {
    const docs = await Genere.find({}, '_id').exec();
    return docs.map(doc => doc._id.toString());
}

// download all records 
module.exports.download = () => {
    return Genere
        .find()
        .exec();
}