db.createRole({
  "role" : "sevensAdmin",
  "privileges" : [
    { resource: { db: "sevens-iam", collection:"" }, actions: [ "find", "update", "insert", "remove" ] }
  ],
  "roles" : [
          {
                  "role" : "readWrite",
                  "db" : "sevens-iam"
          }
  ]
});

db.createUser(
  {
    user: "sevens",
    pwd: "112358",
    roles: [ { role: "sevensAdmin", db: "sevens-iam" } ]
  }
)