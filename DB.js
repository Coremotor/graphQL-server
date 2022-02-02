module.exports = class DB {
  constructor(users) {
    this.users = users;
  }

  getUsers() {
    return this.users;
  }

  getUser(id) {
    return this.users.find((user) => user.id.toString() === id.toString());
  }

  addUser(user) {
    this.users.push(user);
  }

  deleteUser(id) {
    this.users = this.users.filter(
      (user) => user.id.toString() !== id.toString()
    );
  }
};
