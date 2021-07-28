const Command = require('@base/Command.js');
const { MessageEmbed } = require('discord.js')

class ServerInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: ["serverinfo", "server-info", "si"],
            description: "Get information about the current server or a specific server",
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            guildOnly: true
        });
    }
    
    run(message, args) {
        const functions = this.client.functions;

        const region = {
            'us-central': ':flag_us: US Central',
            'us-east': ':flag_us: US East',
            'us-south': ':flag_us: US South',
            'us-west': ':flag_us: US West',
            'europe': ':flag_eu: Europe',
            'singapore': ':flag_sg: Singapore',
            'japan': ':flag_jp: Japan',
            'russia': ':flag_ru: Russia',
            'hongkong': ':flag_hk: Hong Kong',
            'brazil': ':flag_br: Brazil',
            'sydney': ':flag_au: Sydney',
            'southafrica': ':flag_za: South Africa'
        };
        
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

        const members = guild.members.cache.array();
        const memberCount = members.length;
        const bots = members.filter(b => b.user.bot).length;
        const users = memberCount - bots;
        const online = members.filter((m) => m.presence.status !== 'offline').length;

        const channels = guild.channels.cache.array();
        const channelCount = channels.length - channels.filter(c => c.type === 'category').length;
        const textChannels = channels.filter(c => c.type === 'text').length;
        const voiceChannels = channels.filter(c => c.type === 'voice').length;

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
                { name: 'Region', value: region[guild.region], inline: true },
                { name: 'Owner', value: guild.owner.user.tag }
            )
            .addField('Server Stats', data)
            .addFields(
                { name: 'Created Date', value: functions.formatDate(guild.createdAt), inline: true },
                { name: 'Default Notifications', value: notifications[guild.defaultMessageNotifications], inline: true },
                { name: 'Emojis', value: guild.emojis.cache.map(e => `${e}`).join(' ') }
            )
            .setTimestamp();

        if (guild.bannerURL) embed.setImage(guild.bannerURL({ dynamic: true }));

        message.channel.send(embed);
    }
}

module.exports = ServerInfoCommand;