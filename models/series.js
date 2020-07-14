let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let SeriesSchema = new Schema({
  seriesTitle: { type: String, required: true },
  books: [{
    title: { type: Schema.ObjectId, ref: 'Book', required: true },
    author: { type: Schema.ObjectId, ref: 'Author', required: true },
    number: { type: Number, required: true }
  }]
});

SeriesSchema
  .virtual('url')
  .get(function () {
    return '/catalog/series/' + this._id;
  });


module.exports = mongoose.model('Series', SeriesSchema);