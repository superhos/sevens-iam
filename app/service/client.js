/**
 * Application Service
 */
const Service = require('egg').Service;

class ClientService extends Service {
  async find(data) {
    const client = await this.ctx.model.Client.find(data);
    return client;
  }
  
  async findOne(data) {
    const client = await this.ctx.model.Client.findOne(data);
    return client;
  }


  async insert(data) {
    const res = await this.ctx.model.Client.create({
        ...data,
    }).catch(err => console.error(err.stack))

    return res
  }
}

module.exports = ClientService;