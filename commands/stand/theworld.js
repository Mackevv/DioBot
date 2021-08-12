const Command = require("@base/Command");
const { MessageEmbed } = require('discord.js');

class TheWorldCommand extends Command {
    constructor(client) {
        super(client, {
            name: "theworld",
            aliases: ["zawarudo", "stoptime"],
            description: "Use Dio's stand ability to stop the time",
            permissions: "MANAGE_CHANNELS",
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"]
        });
    }

    async run(message, args) {
        const functions = this.client.functions;

        if (!args[0]) return message.replyError("please provide an amount of time to stop.");
        if (isNaN(args[0])) return message.replyError("please provide a valid duration.");

        const duration = parseInt(args[0]);

        let targetChannel = message.channel;
        if (args[1]) targetChannel = functions.getChannel(args[1], message.guild);
        if (!targetChannel) return message.replyError('channel not found, please specify a correct id or mention.')

        const gifs = [
            {
                name: 'popularTheWorld',
                gif: 'https://media.giphy.com/media/ZJSgOmUq8tyqaxxDf3/giphy.gif',
                replies: ['ZA WARUDO', 'ZA WARUDOO', 'ZA WARUDOO', 'ZA WAARUDOOOO'],
                duration: 3.8
            },
            {
                name: 'vsKakyoinTheWorld',
                gif: 'https://media.giphy.com/media/po87cMgPAxi07QAzoJ/giphy.gif',
                replies: ['ZA, WARUDO', 'ZA, WAARUDO', 'ZA, WAAARUDO'],
                duration: 2.3
            },
            {
                name: 'knivesTheWorld',
                gif: 'https://media.giphy.com/media/qRtbKx34WaPxFp9HQu/giphy.gif',
                replies: ['... ZA WARUDO!'],
                duration: 3.3
            }
        ];

        const gif = gifs[Math.floor(Math.random() * gifs.length)];

        const embed = new MessageEmbed()
            .defaultColor()
            .setTitle(gif.replies[Math.floor(Math.random() * gif.replies.length)])
            .setImage(gif.gif)
            .setFooter(`Source : JoJo's Bizarre Adventure | ${this.client.config.prefix}${this.options.name}`)

        const msg = await targetChannel.send(embed);

        const validPermOverwrites = [];
        targetChannel.permissionOverwrites.forEach((perms) => {
            if (targetChannel.permissionsFor(perms.id).has('SEND_MESSAGES') || message.guild.roles.everyone.id === perms.id) {
                validPermOverwrites.push(perms.id);
            }
        });

        setTimeout(() => {
            embed.setImage('');
            embed.setFooter('');

            for (const perm of validPermOverwrites) {
                message.channel.updateOverwrite(perm, { SEND_MESSAGES: false });
            }

            let i = 0;
            const interval = setInterval(() => {
                i += 1;
                embed.setTitle(i === 1 ? "1 second has passed" : `${i} seconds have passed`);
                msg.edit(embed);

                if (i === duration) {
                    clearInterval(interval);
                    embed.setTitle("Time has begun to move again");
                    msg.edit(embed);
                    for (const perm of validPermOverwrites) {
                        message.channel.updateOverwrite(perm, { SEND_MESSAGES: true });
                    }
                }
            }, 3000);
        }, 1000 * gif.duration);

        message.delete();
    }
}

module.exports = TheWorldCommand;