const { CustomError, statusCodes } = require("./errors");
const { connect } = require("./supabase");

const TABLE_NAME = "users";
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
  const { data: user, error } = await connect()
    .from(TABLE_NAME)
    .select("*")
    .eq("userid", id);
  if (!user.length) {
    throw new CustomError("User not found", statusCodes.NOT_FOUND);
  }

  if (error) {
    throw error;
  }

  return user;
}

async function login(loginData) {
  const {data: user, error} = await connect()
    .from(TABLE_NAME)
    .select("*")
    .eq("username", loginData.username)
    .eq("password", loginData.password)
  if (!user.length) {
    throw new CustomError("User not found", statusCodes.NOT_FOUND);
  }

  if (error) {
    throw error;
  }

  return user;
}

async function create(user) {
  if(!isAdmin){
    throw CustomError("Sorry, you are not authorized to create a new item", statusCodes.UNAUTHORIZED)
}
const { data: newUser, error } = await connect().from(TABLE_NAME).insert(user).select('*')
if (error) {
    throw error
}
return newUser
}

async function update(id, user) {
  if (!isAdmin) {
    throw CustomError(
      "Sorry, you are not authorized to update this user",
      statusCodes.UNAUTHORIZED
    );
  }

  const { data: updatedUser, error } = await connect()
    .from(TABLE_NAME)
    .update(user)
    .eq("userId", id)
    .select("*");
  if (error) {
    throw error;
  }
  return updatedUser;
}

async function remove(id) {
  if (!isAdmin) {
    throw CustomError(
      "Sorry, you are not authorized to delete this user",
      statusCodes.UNAUTHORIZED
    );
  }
  const { data: deletedUser, error } = await connect()
    .from(TABLE_NAME)
    .delete()
    .eq("userId", id);
  if (error) {
    throw error;
  }
  return deletedUser;
}

module.exports = {
  getAll,
  get,
  login,
  create,
  update,
  remove,
};
