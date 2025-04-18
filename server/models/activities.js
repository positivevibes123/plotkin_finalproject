const { CustomError, statusCodes } = require("./errors");
const { connect } = require("./supabase");

const TABLE_NAME = "activities";
const isAdmin = true;

async function getAll() {
  const list = await connect().from(TABLE_NAME).select("*");
  if (list.error) {
    throw error;
  }
  return {
    data: list.data,
    count: list.count,
  };
}

async function get(id) {
  const { data: activity, error } = await connect()
    .from(TABLE_NAME)
    .select("*")
    .eq("activityId", id);
  if (!activity.length) {
    throw new CustomError("User not found", statusCodes.NOT_FOUND);
  }

  if (error) {
    throw error;
  }

  return activity;
}

async function create(activity) {
  const { data: newActivity, error } = await connect()
    .from(TABLE_NAME)
    .insert(activity)
    .select("*");
  if (error) {
    throw error;
  }
  return newActivity;
}

async function update(id, activity) {
  const { data: updatedActivity, error } = await connect()
    .from(TABLE_NAME)
    .update(activity)
    .eq("activityId", id)
    .select("*");
  if (error) {
    throw error;
  }
  return updatedActivity;
}

async function remove(id) {
  const { data: deletedActivity, error } = await connect()
    .from(TABLE_NAME)
    .delete()
    .eq("activityId", id);
  if (error) {
    throw error;
  }
  return deletedActivity;
}

module.exports = {
  getAll,
  get,
  create,
  update,
  remove,
};
