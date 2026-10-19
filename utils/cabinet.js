const ownerOf = (req) => (req.get("x-cabinet-user") || "").trim();

const cabinetFilter = (req, extra = {}) => {
  const owner = ownerOf(req);
  if (owner) return { ...extra, doctorUsername: owner };
  return {
    ...extra,
    $or: [
      { doctorUsername: "" },
      { doctorUsername: null },
      { doctorUsername: { $exists: false } },
    ],
  };
};

const belongsToCabinet = (req, doc) => {
  const owner = ownerOf(req);
  const docOwner = doc?.doctorUsername || "";
  if (owner) return docOwner === owner;
  return docOwner === "";
};

module.exports = { ownerOf, cabinetFilter, belongsToCabinet };
