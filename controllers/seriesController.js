var Series = require('../models/series');

// Display list of all Series.
exports.series_list = function (req, res, next) {

  Series.find({}, 'seriesTitle')
    .populate('title')
    .populate('author')
    .exec(function (err, list_series) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('series_list', { title: 'Series List', series_list: list_series });
    });

};

// Display detail page for a specific Series.
exports.series_detail = function (req, res) {
  res.send('NOT IMPLEMENTED: Series detail: ' + req.params.id);
};

// Display Series create form on GET.
exports.series_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Series create GET');
};

// Handle Series create on POST.
exports.series_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Series create POST');
};

// Display Series delete form on GET.
exports.series_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Series delete GET');
};

// Handle Series delete on POST.
exports.series_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Series delete POST');
};

// Display Series update form on GET.
exports.series_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Series update GET');
};

// Handle Series update on POST.
exports.series_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Series update POST');
};