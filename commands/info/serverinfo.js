const Command = require('@base/Command.js');
const { MessageEmbed } = require('discord.js')

class ServerInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "serverinfo",
            aliases: ["server-info", "si"],
            description: "Display information about the current server or a specific server",
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            guildOnly: true
        });
    }

    async run(message, args) {
        const functions = this.client.functions;

        const notifications = {
            ALL: 'All',
            MENTIONS: 'Mentions'
        };

        let { guild } = message;

        if (args[0]) {
            try {
                guild = this.client.guilds.cache.get(args[0]);
            } catch (e) {
                console.error(e);
            }
        }

        const roleCount = guild.roles.cache.size - 1;

        const memberCount = guild.memberCount;
        const bots = guild.members.cache.filter(b => b.user.bot).size
        const users = memberCount - bots;
        const online = guild.members.cache.filter(m => m.presence !== null).size;
        const owner = await guild.fetchOwner();

        const channelCount = guild.channels.channelCountWithoutThreads - guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size;
        const textChannels = guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size;

        const premiumTier = functions.ucfirst(message.guild.premiumTier.toLowerCase());
        const boostCount = message.guild.premiumSubscriptionCount;

        const data = `\`\`\`css
Members          -  [ ${memberCount} ]
Users            -    ${users}
Bots             -    ${bots}
Online Members   -    ${online}
Channels         -  [ ${channelCount} ]
Text Channels    -    ${textChannels}
Voice Channels   -    ${voiceChannels}
Roles            -  [ ${roleCount} ]\`\`\``;

        const embed = new MessageEmbed()
            .defaultColor()
            .setTitle(`Oh? You want to know more about ${guild.name}?`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: 'ID', value: guild.id, inline: true },
                { name: 'Owner', value: owner.user.tag, inline: true }
            )
            .addField('Server Stats', data)
            .addFields(
                { name: 'Created Date', value: functions.formatDate(guild.createdAt), inline: true },
                { name: 'Boost Status', value: `${premiumTier} tier, ${boostCount} boost`, inline: true },
                { name: 'Emojis', value: guild.emojis.cache.map(e => `${e}`).join(' ') }
            )
            .setTimestamp();

        if (guild.bannerURL) embed.setImage(guild.bannerURL({ dynamic: true }));

        message.channel.send({ embeds: [embed] });
    }
}

module.exports = ServerInfoCommand;