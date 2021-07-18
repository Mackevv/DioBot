module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run (message) {
        try {
            const client = this.client;
            const config = this.client.config;

            if (!message.content.startsWith(config.prefix)) return;
            if (message.author.bot) return;

            const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();
            const cmd = client.commands.get(command);

            if (cmd) {
                const options = cmd.options;
                let {
                    name,
                    description,
                    permissions,
                    botPermissions,
                    permissionError,
                    guildOnly
                } = options;


                if (permissions.length) {
                    if (typeof permissions === 'string') {
                        permissions = [permissions];
                    }
                    client.validatePermissions(permissions);
                }

                if (botPermissions.length) {
                    if (typeof botPermissions === 'string') {
                        botPermissions = [botPermissions];
                    }
                    client.validatePermissions(botPermissions);
                }

                for (const permission of permissions) {
                    if (!message.member.hasPermission(permission)) {
                        if (permissionError) {
                            return message.channel.send(permissionError);
                        } else {
                            return message.reply("you are not allowed to use this command.");
                        }
                    }
                }

                for (const botPermission of botPermissions) {
                    const bot = message.guild.member(config.clientId);
                    if (!bot.hasPermission(botPermission)) {
                        return message.reply("I do not have the required permissions to execute this command.");
                    }
                }
                
                if (guildOnly && message.channel.type === 'dm') {
                    return message.reply("you can't use this command in direct message.");
                }
                
                if (cmd.settings.category === 'owner' && message.author.id !== config.owner.id) {
                    return;
                }
                
                await cmd.run(message, args);
            }
        } catch (e) {
            console.error(e);
        }
    }
}