'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: function (queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.removeColumn('pets', 'photoUrl');
  },

  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.addColumn('pets', 'photoUrl', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
};
