'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [adminUser] = await queryInterface.sequelize.query(
      `SELECT id from users WHERE email = 'admin@admin.com';`,
    );

    return queryInterface.bulkInsert('posts', [
      {
        title: faker.word.sample({ length: 2 }),
        description: faker.lorem.sentences(1),
        content: faker.lorem.sentences(1),
        isPublished: faker.datatype.boolean(),
        userId: adminUser[0].id,
        petCategoryId: faker.number.int({ max: 5, min: 1 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
