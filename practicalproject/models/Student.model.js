const mongoose = require('mongoose');

var StudentSchema = new mongoose.Schema({
    RollNo: {
        type: String,
    },
    DOB: {
        type: String
    },
    Name: {
        type: String
    },
    Score: {
        type: String
    }
});


mongoose.model('Student', StudentSchema);