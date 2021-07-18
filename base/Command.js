module.exports = class Command {
    constructor(client, {
        name,
        description = '',
        permissions = [],
        botPermissions = [],
        permissionError = null,
        guildOnly = false
    }) {
        this.client = client;
        this.options = { name, description, permissions, botPermissions, permissionError, guildOnly };
        this.settings = { };
    }
};