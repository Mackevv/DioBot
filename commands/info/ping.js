const Command = require("@base/Command.js");
const { MessageEmbed } = require('discord.js');

class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            aliases: "latency",
            description: "Get bot latency",
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"]
        });
    }

    run(message) {
        const embed = new MessageEmbed()
            .setColor(this.client.config.embed.color)
            .setDescription(":stopwatch: **The World !**");

        message.channel.send({ embeds: [embed] }).then((resultMsg) => {
            setTimeout(() => {
                const ping = resultMsg.createdTimestamp - message.createdTimestamp;

                const resultEmbed = new MessageEmbed()
                    .defaultColor()
                    .addFields(
                        { name: "Bot latency :", value: `${ping} ms` },
                        { name: "API latency :", value: `${this.client.ws.ping} ms` }
                    );

                resultMsg.edit({ embeds: [resultEmbed] });
            }, 1300);
        });
    }
}

module.exports = PingCommand;