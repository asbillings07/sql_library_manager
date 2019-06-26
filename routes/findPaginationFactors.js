const findPaginationFactors = req => {
  let page = +req.query.page || 0;
  let pageSize = +req.query.pageSize || 0;
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
