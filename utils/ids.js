
import mongoose from "mongoose";

export const isObjectId = (v) => mongoose.Types.ObjectId.isValid(String(v));

export function idOrSlugQuery(idOrSlug, slugField = "slug") {
  const val = String(idOrSlug || "").trim();
  return isObjectId(val) ? { _id: val } : { [slugField]: val.toLowerCase() };
}

export async function resolveByIdOrSlug(Model, idOrSlug, { select, slugField = "slug" } = {}) {
  const query = idOrSlugQuery(idOrSlug, slugField);
  const q = Model.findOne(query);
  if (select) q.select(select);
  const doc = await q;
  return doc; // null if not found
}
