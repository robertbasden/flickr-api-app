const Union = require('tagged-union');

export default new Union(['NotStarted',
    'Fetching',
    'Complete',
    'Error']);
