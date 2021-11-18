const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Student = mongoose.model('Student');

router.get('/', (req, res) => {
    res.render("Student/addOrEdit", {
        viewTitle: "Insert Student"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var Student = new Student();
    Student.RollNo = req.body.RollNo;
    Student.DOB = req.body.DOB;
    Student.Name = req.body.Name;
    Student.Score = req.body.Score;
    Student.save((err, doc) => {
        if (!err)
            res.redirect('Student/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("Student/addOrEdit", {
                    viewTitle: "Insert Student",
                    Student: req.body
                });
            } else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
    Student.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('Student/list'); } else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("Student/addOrEdit", {
                    viewTitle: 'Update Student',
                    Student: req.body
                });
            } else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Student.find((err, docs) => {
        if (!err) {
            res.render("Student/list", {
                list: docs
            });
        } else {
            console.log('Error in retrieving employee list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'RollNo':
                body['RollNoError'] = err.errors[field].message;
                break;
            case 'DOB':
                body['DOBError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Student.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("Student/addOrEdit", {
                viewTitle: "Update Student",
                Student: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Student.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/Student/list');
        } else { console.log('Error in Student delete :' + err); }
    });
});

module.exports = router;