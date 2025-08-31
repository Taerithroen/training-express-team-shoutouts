'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Shoutouts', [
      {
        cheerName: 'RED HOT',
        signText: 'H-O-T!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cheerName: 'DO IT AGAIN',
        signText: 'Go, Fight, Win',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cheerName: '2 BITS',
        signText: 'Holler!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        cheerName: 'STOMP YOUR FEET',
        signText: 'STOMP!',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Shoutouts', null, {});
  }
};