let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let AuthorSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
});

AuthorSchema.virtual('name').get(function () {
  var fullname = '';

  if (this.first_name && this.last_name) {
    fullname = this.last_name + ', ' + this.first_name;
  }

  if (!this.first_name || !this.last_name) {
    fullname = '';
  }
  return fullname;
});

AuthorSchema.virtual('url').get(function () {
  return '/catalog/author/' + this._id;
});

module.exports = mongoose.model('Author', AuthorSchema);