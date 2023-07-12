'use strict';

const { faker } = require('@faker-js/faker');
const { hash } = require('bcrypt');

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

const generageFakeUsers = async () => {
  const users = [];

  for (let i = 0; i < 10; i++) {
    let user = {
      name: faker.person.firstName(),
      email: faker.internet.email(),
      password: await hash('123456', 10),
      isDeleted: faker.datatype.boolean(),
      isVerified: faker.datatype.boolean(),
      phoneNumber: faker.phone.number('###########'),
    };

    users.push(user);
  }

  users.push({
    name: 'Admin',
    email: 'admin@admin.com',
    password: await hash('123456', 10),
    isDeleted: false,
    isVerified: true,
    phoneNumber: '501-039-841',
  });

  return users;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const users = await generageFakeUsers();
      const categories = generateFakeCategories();

      await queryInterface.bulkInsert(
        'roles',
        [{ name: 'admin' }, { name: 'user' }],
        { transaction },
      );

      await queryInterface.bulkInsert('users', users, { transaction });

      await queryInterface.bulkInsert('petcategories', categories, {
        transaction,
      });

      const [adminUser] = await queryInterface.sequelize.query(
        `SELECT id from users WHERE email = 'admin@admin.com';`,
        { transaction },
      );

      const [databaseUsers] = await queryInterface.sequelize.query(
        `SELECT id from users;`,
        { transaction },
      );

      const [userRole] = await queryInterface.sequelize.query(
        `SELECT id from roles where name = 'user';`,
        { transaction },
      );

      const [adminRole] = await queryInterface.sequelize.query(
        `SELECT id from roles where name = 'admin';`,
        { transaction },
      );

      databaseUsers.forEach(async (user) => {
        await queryInterface.bulkInsert(
          'userroles',
          [{ userId: user.id, roleId: userRole[0].id }],
          {
            transaction,
          },
        );
      });

      await queryInterface.bulkInsert(
        'userroles',
        [{ userId: adminUser[0].id, roleId: adminRole[0].id }],
        {
          transaction,
        },
      );

      transaction.commit();

      return queryInterface;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    return await queryInterface.bulkDelete('petcategories');
  },
};
