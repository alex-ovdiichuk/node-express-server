exports.get404 = (req, res) => {
  res.render("404", { pageTitle: "Not Found", path: null });
};
