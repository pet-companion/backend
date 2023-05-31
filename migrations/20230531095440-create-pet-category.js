'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('petcategories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    return queryInterface;
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('petcategories');
    return queryInterface;
  },
};
