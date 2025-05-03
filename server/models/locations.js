const { CustomError, statusCodes } = require("./errors");
const { connect } = require("./supabase");

const TABLE_NAME = "location";

async function getAll() {
  const list = await connect().from(TABLE_NAME).select("*");
  if (list.error) {
    throw list.error;
  }
  return {
    data: list.data,
    count: list.count,
  };
}

async function getByUserId(userid) {
  const { data: locations, error } = await connect()
    .from(TABLE_NAME)
    .select("*")
    .eq("userid", userid);
  
  if (error) {
    throw error;
  }
  
  return locations;
}

async function get(id) {
  const { data: location, error } = await connect()
    .from(TABLE_NAME)
    .select("*")
    .eq("locationid", id);
  if (!location.length) {
    throw new CustomError("Location not found", statusCodes.NOT_FOUND);
  }

  if (error) {
    throw error;
  }

  return location;
}

async function create(location) {
  const { data: newLocation, error } = await connect()
    .from(TABLE_NAME)
    .insert(location)
    .select("*");
  if (error) {
    throw error;
  }
  return newLocation;
}

async function update(id, location) {
  const { data: updatedLocation, error } = await connect()
    .from(TABLE_NAME)
    .update(location)
    .eq("locationid", id)
    .select("*");
  if (error) {
    throw error;
  }
  return updatedLocation;
}

async function remove(id) {
  const { data: deletedLocation, error } = await connect()
    .from(TABLE_NAME)
    .delete()
    .eq("locationid", id);
  if (error) {
    throw error;
  }
  return deletedLocation;
}

module.exports = {
  getAll,
  get,
  getByUserId,
  create,
  update,
  remove,
};
