require('module-alias/register');
require('@util/extenders');

const Dio = require('@base/Dio.js');
const client = new Dio();

client.loadCommands('./commands/');
client.loadEvents('./events/');

client.login(client.config.token);