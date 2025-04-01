const data = require('../data/users.json')

async function getAll() {
  return data
}

async function get(id) {
  const user = data.find((user) => user.id === id)
  if (!user) {
    throw new Error(`User with id ${id} not found`)
  }
  return user
}

async function create(user) {
  const newUser = { id: data.length + 1, ...user }
  data.push(newUser)
  return newUser
}

async function update(id, user) {
  const index = data.findIndex((user) => user.id === id)
  if (index === -1) {
    throw new Error(`User with id ${id} not found`)
  }

  const updatedUser = { ...data[index], ...user }
  data[index] = updatedUser
  return data[index]
}

async function remove(id) {
  const index = data.findIndex((user) => user.id === id)
  if (index === -1) {
    throw new Error(`User with id ${id} not found`)
  }

  const deletedUser = data.splice(index, 1)
  return deletedUser[0]
}

module.exports = {
  getAll,
  get,
  create,
  update,
  remove,
}