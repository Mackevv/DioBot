module.exports = class Command {
    constructor(client, {
        name,
        aliases = [],
        description = null,
        permissions = [],
        botPermissions = [],
        permissionError = null,
        guildOnly = false
    }) {
        this.client = client;
        this.options = { name, aliases, description, permissions, botPermissions, permissionError, guildOnly };
        this.settings = {};
    }
};