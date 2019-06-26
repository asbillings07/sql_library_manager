const findPaginationFactors = req => {
  let page = +req.query.page || 1;
  let pageSize = +req.query.pageSize || 1;
  let offset = page * pageSize;
  let limit = pageSize;
  return {
    offset,
    limit,
    page,
    pageSize
  };
};
exports.findPaginationFactors = findPaginationFactors;
