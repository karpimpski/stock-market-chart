const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var stockSchema = new Schema({
	name: String
});

module.exports = mongoose.model('Stock', stockSchema);