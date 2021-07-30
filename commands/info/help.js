const Command = require('@base/Command');
const { MessageEmbed } = require('discord.js');
const cmdHelp = require('@util/commands-help.json');

class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            aliases: "h",
            description: "List all the available commands of this bot",
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"]
        });
    }

    run(message, args) {
        const client = this.client;
        const { prefix } = client.config;
        const functions = client.functions;

        const categories = [];
        client.commands.forEach((command) => {
            if (!categories.includes(command.settings.category) && command.settings.category !== 'owner') {
                categories.push(command.settings.category);
            }
        });

        if (!args[0]) {
            const embed = new MessageEmbed()
                .defaultColor()
                .setTitle("Help Menu")
                .setThumbnail(client.user.displayAvatarURL({ size: 512, dynamic: true }))
                .setDescription(`Use \`${prefix}help <category>\` to display all commands related to this category.`)
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();

            for (const category of categories) {
                embed.addField(functions.ucfirst(category), `\`${prefix}help ${category}\``);
            }

            return message.channel.send(embed);
        }

        // Display commands related to one category
        for (const category of categories) {
            if (category === args[0]) {
                const commands = client.commands.filter(c => c.settings.category === category);

                const categoryEmbed = new MessageEmbed()
                    .defaultColor()
                    .setTitle(`Help ${functions.ucfirst(category)} - (${commands.size})`)
                    .setThumbnail(client.user.displayAvatarURL({ size: 512, dynamic: true }))
                    .setDescription(`Use \`${prefix}help <command>\` to get more informations about a command.`)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();

                commands.forEach((command) => {
                    categoryEmbed.addField(`${prefix}${command.options.name}`, `${command.options.description}.`);
                });

                return message.channel.send(categoryEmbed);
            }
        }

        // Display a specific command help
        const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
        if (!command) {
            return message.replyError("command or category not found, please specify a valid name.");
        }

        const usage = functions.help(cmdHelp[command.settings.category][command.options.name]["USAGE"], { prefix: prefix });
        const examples = functions.help(cmdHelp[command.settings.category][command.options.name]["EXAMPLES"], {
            prefix: prefix,
            authorId: message.author.id,
            authorTag: message.author.tag
        });

        const cmdEmbed = new MessageEmbed()
            .defaultColor()
            .setTitle(functions.ucfirst(command.options.name))
            .setDescription(`
**Description :** ${command.options.description}.
**Reminder :** Symbols \`<>\` indicate a required parameter, \`<? >\` indicate an optional parameter and \`< | >\` indicate several possible parameters.
            `)
            .addFields(
                { name: 'Usage', value: usage },
                { name: 'Examples', value: examples },
            )
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        if (command.options.aliases.length) {
            const aliases = command.options.aliases.join(', ');
            cmdEmbed.addField('Aliases', aliases);
        }

        if (cmdHelp[command.settings.category][command.options.name]["NOTES"]) {
            const notes = cmdHelp[command.settings.category][command.options.name]["NOTES"];
            cmdEmbed.addField('Notes', notes);
        }

        return message.channel.send(cmdEmbed);
    }
}

module.exports = HelpCommand;