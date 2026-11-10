const ownerOf = (req) => req.user.id;

const cabinetFilter = (req, extra = {}) => ({
  ...extra,
  doctorId: ownerOf(req),
});

const belongsToCabinet = (req, doc) => {
  return String(doc?.doctorId) === String(ownerOf(req));
};

module.exports = {
  ownerOf,
  cabinetFilter,
  belongsToCabinet,
};