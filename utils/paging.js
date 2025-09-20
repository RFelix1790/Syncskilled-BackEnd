
export function parsePaging(q = {}, { defaultLimit = 50, maxLimit = 100 } = {}) {
  const page = Math.max(parseInt(q.page ?? "1", 10) || 1, 1);
  const rawLimit = parseInt(q.limit ?? String(defaultLimit), 10) || defaultLimit;
  const limit = Math.min(Math.max(rawLimit, 1), maxLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function paged(items, page, limit, total) {
  return {
    items,
    page,
    limit,
    total,
    pages: Math.ceil(total / Math.max(limit, 1)),
  };
}
