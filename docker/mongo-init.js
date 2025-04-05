db = db.getSiblingDB('yodol');

db.createUser({
  user: "admin",
  pwd: "admin",
  roles: [
    { role: "readWrite", db: "yodol" }
  ]
});
