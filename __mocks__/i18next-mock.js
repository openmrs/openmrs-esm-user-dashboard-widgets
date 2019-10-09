const mockInitConfigs = [];

const mockI18n = {
  use: function() {
    return {
      init: function(config) {
        mockInitConfigs.push(config);
      }
    };
  },
  changeLanguage: jest.fn()
};

module.exports = mockI18n;

module.exports.getMockInitConfigs = () => mockInitConfigs;
