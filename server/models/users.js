const data = require('../data/users.json')

async function getAll() {
  return data.users
}

async function get(id) {
  const user = data.users.find((user) => user.id === id)
  if (!user) {
    throw new Error(`User with id ${id} not found`)
  }
  return user
}

async function create(user) {
  const newUser = { id: data.users.length + 1, ...user }
  data.users.push(newUser)
  return newUser
}

async function update(id, user) {
  const index = data.users.findIndex((user) => user.id === id)
  if (index === -1) {
    throw new Error(`User with id ${id} not found`)
  }

  const updatedUser = { ...data[index], ...user }
  data.users[index] = updatedUser
  return data.users[index]
}

async function remove(id) {
  const index = data.users.findIndex((user) => user.id === id)
  if (index === -1) {
    throw new Error(`User with id ${id} not found`)
  }

  const deletedUser = data.users.splice(index, 1)
  return deletedUser[0]
}

module.exports = {
  getAll,
  get,
  create,
  update,
  remove,
}