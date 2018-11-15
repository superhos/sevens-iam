'use strict';
/**
 * baseService Service
 */
const Service = require('egg').Service;

class baseService extends Service {

  constructor(...args) {
    super(...args);
    this.className = this.constructor.name.replace('Service', '');
  }

  async find(data) {
    const res = await this.ctx.model[this.className].find(data);
    return this.res(res);
  }

  async findOne(data) {
    const res = await this.ctx.model[this.className].findOne(data);
    return this.res(res);
  }

  async create(data) {
    const res = await this.ctx.model[this.className].create({
      ...data,
    }).catch(err => console.error(err.stack));

    return this.res(res);
  }

  async destroy(data) {
    const res = await this.ctx.model[this.className].deleteOne({
      ...data,
    }).catch(err => console.error(err.stack));

    return this.res(res);
  }

  res(data) {
    return data ? data.toJSON() : data;
  }
}

module.exports = baseService;
