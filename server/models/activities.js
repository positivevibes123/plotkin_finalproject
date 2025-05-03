const { CustomError, statusCodes } = require("./errors");
const { connect } = require("./supabase");

const TABLE_NAME = "activities";

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

async function getByUserId(userid) {
  const { data: activities, error } = await connect()
    .from(TABLE_NAME)
    .select("*")
    .eq("userid", userid);
  
  if (error) {
    throw error;
  }
  
  return activities;
}

async function get(id) {
  const { data: activity, error } = await connect()
    .from(TABLE_NAME)
    .select("*")
    .eq("activityid", id);
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
    .eq("activityid", id)
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
    .eq("activityid", id);
  if (error) {
    throw error;
  }
  return deletedActivity;
}

module.exports = {
  getAll,
  get,
  getByUserId,
  create,
  update,
  remove,
};
