const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const AppController = require('./appController');
const RedisClient = require('../utils/redis');
const DBClient = require('../utils/db');

const { expect } = chai;

chai.use(chaiHttp);

describe('AppController', () => {
  describe('getStatus', () => {
    it('should return status with redis and db information', async () => {
      sinon.stub(RedisClient, 'isAlive').returns(true);
      sinon.stub(DBClient, 'isAlive').returns(true);

      const request = {};
      const response = {
        status: (statusCode) => {
          expect(statusCode).to.equal(200);
          return {
            send: (status) => {
              expect(status).to.deep.equal({
                redis: true,
                db: true,
              });
            },
          };
        },
      };

      await AppController.getStatus(request, response);

      RedisClient.isAlive.restore();
      DBClient.isAlive.restore();
    });
  });

  describe('getStats', () => {
    it('should return statistics for users and files', async () => {
      sinon.stub(DBClient, 'nbUsers').returns(42);
      sinon.stub(DBClient, 'nbFiles').returns(100);

      const request = {};
      const response = {
        status: (statusCode) => {
          expect(statusCode).to.equal(200);
          return {
            send: (stats) => {
              expect(stats).to.deep.equal({
                users: 42,
                files: 100,
              });
            },
          };
        },
      };

      await AppController.getStats(request, response);

      DBClient.nbUsers.restore();
      DBClient.nbFiles.restore();
    });
  });
});
