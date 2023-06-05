'use strict';

const { faker } = require('@faker-js/faker');

const generateFakeCategories = () => {
  const categories = [];

  for (let i = 0; i < 10; i++) {
    let category = {
      name: faker.word.noun(),
    };

    categories.push(category);
  }

  return categories;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const categories = generateFakeCategories();

    return await queryInterface.bulkInsert('petcategories', categories, {});
  },

  async down(queryInterface) {
    return await queryInterface.bulkDelete('petcategories');
  },
};
