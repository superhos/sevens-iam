/**
 * Client model
 * @param {*} app 
 */
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ClientSchema = new Schema({
    name: { type: String },
    title: { type: String  },
    description: { type: String  },
    secret: { type: String  },
    redirect: { type: String  },
    user_id: { type: String  },
  });

  return mongoose.model('Client', ClientSchema);
}
