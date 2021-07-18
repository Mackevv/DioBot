const Command = require("../../base/Command.js");
const { MessageEmbed } = require('discord.js');

class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: "ping",
			description: "Get client latency",
			botPermissions: ["SEND_MESSAGES"]
		});
	}

    run (message) {
        const embed = new MessageEmbed()
            .setColor(this.client.config.embed.color)
            .setDescription(":stopwatch: **The World !**")
        ;
            
        message.channel.send(embed).then((resultMsg) => {
            setTimeout(() => {
                const ping = resultMsg.createdTimestamp - message.createdTimestamp;
                
                const resultEmbed = new MessageEmbed()
                    .setColor(this.client.config.embed.color)
                    .addFields(
                        { name: "Bot latency :", value: `${ping} ms` },
                        { name: "API latency :", value: `${this.client.ws.ping} ms` }
                    )
                ;
                
                resultMsg.edit(resultEmbed);
            }, 1300);
        });
    }
}

module.exports = PingCommand;