async function paginateResults({
  page = 1,
  limit = 4,
  results,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}) {
  const sortField = sortOrder === 'asc' ? sortBy : `-${sortBy}`;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = {};

  if (endIndex < results.length) {
    paginatedResults.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    paginatedResults.previous = {
      page: page - 1,
      limit,
    };
  }

  paginatedResults.total = results.length;
  paginatedResults.results = await results
    .sort(sortField)
    .limit(limit)
    .skip(startIndex)
    .exec();

  return paginatedResults;
}

module.exports = {
  paginateResults,
};
