const express = require('express');
const { getAllUserDocs } = require('../controller/dairycontrol.js');
const Dairy = require('../models/dairy.js');

const dairyRoute = express.Router();

// Get all user documents
dairyRoute.get('/all', async (req, res) => {
    try {
        const dairy = await getAllUserDocs(req);
        if (!dairy || dairy.length <= 0) {
            return res.status(404).json({ message: "Content not available" });
        }
        res.status(200).json(dairy);
    } catch (error) {
        console.error(error); // Use console.error for logging errors
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add a new user document
dairyRoute.post('/add', async (req, res) => {
    try {
        const { title, document, date } = req.body; // Destructure title and doc from req.body

        const newdoc = new Dairy({ title, document,date, user: req.user._id }); // Simplify document creation

        await newdoc.save();

        res.status(201).json({ message: "Document added successfully", doc: newdoc }); // Return the added document in the response
    } catch (error) {
        console.error(error); // Use console.error for logging errors
        res.status(500).json({ error: "Internal Server Error" }); // Improved error message
    }
});

dairyRoute.get('/edit/:id', async (req, res) => {
    try {
        const editdata = await Dairy.findById(req.params.id);
        if (editdata) {
            res.status(200).json(editdata);
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Edit a user document
dairyRoute.put('/edit/:id', async (req, res) => {
    try {
        const { title, document, date } = req.body; // Destructure title and doc from req.body
        const updatedDoc = await Dairy.findByIdAndUpdate(req.params.id, { title, document, date }, { new: true });
        res.status(200).json({ message: "Document Update Successful", updatedDoc });
    } catch (error) {
        console.error(error); // Use console.error for logging errors
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete a user document
dairyRoute.delete('/delete/:id', async (req, res) => {
    try {
        const deletedDoc = await Dairy.findByIdAndDelete(req.params.id);
        if (!deletedDoc) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json({ message: "Document deleted successfully", deletedDoc });
    } catch (error) {
        console.error(error); // Use console.error for logging errors
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = dairyRoute; 