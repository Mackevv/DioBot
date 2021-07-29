const Command = require('@base/Command');
const { MessageEmbed } = require('discord.js');

class UserInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "userinfo",
            aliases: ["user-info", "ui"],
            description: "Get yours or someone user information",
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            guildOnly: true
        });
    }

    async run(message, args) {
        const functions = this.client.functions;

        const status = {
            online: `${this.client.emotes.status.online} Online`,
            dnd: `${this.client.emotes.status.dnd} Do not disturb`,
            idle: `${this.client.emotes.status.idle} Idle`,
            offline: `${this.client.emotes.status.offline} Offline`
        }
        
        const targetMember = args[0] ? await functions.getMember(args[0], message.guild) : message.guild.member(message.author);
        if (!targetMember) {
            return message.replyError("please provide a valid member mention, id or tag.")
        }

        // Get user custom status and activity
        const activities = targetMember.presence.activities;
        const customStatus = activities.find(a => a.type === 'CUSTOM_STATUS') ? activities.find(a => a.type === 'CUSTOM_STATUS').state : 'None';
        const activity = activities.find(a => a.type === 'PLAYING' || a.type === 'WATCHING' || a.type === 'LISTENING') ? activities.find(a => a.type === 'PLAYING' || a.type === 'WATCHING' || a.type === 'LISTENING').name : 'None';

        // Get user roles except @everyone role
        let roles = targetMember.roles.cache.map(r => `${r}`).join(', ').replace(', @everyone', '');
        const roleCount = targetMember.roles.cache.size - 1;
        if (roleCount === 0) {
            roles = "None";
        }

        const embed = new MessageEmbed()
            .defaultColor()
            .setAuthor(targetMember.user.tag, targetMember.user.displayAvatarURL({ dynamic: true}))
            .setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'ID', value: targetMember.id, inline: true },
                { name: 'Bot', value: targetMember.user.bot ? 'Yes' : 'No', inline: true },
                { name: 'Nickname', value: targetMember.nickname ? targetMember.nickname : 'None' , inline: true },
                { name: 'Status', value: status[targetMember.presence.status], inline: false },
                { name: 'Custom Status', value: customStatus },
                { name: 'Activity', value: activity },
                { name: 'Created Date', value: functions.formatDate(targetMember.user.createdAt) },
                { name: 'Joined Date', value: functions.formatDate(targetMember.joinedAt) },
                { name: `Role(s) - ${roleCount}`, value: roles }
            )
            .setTimestamp();
        
        message.channel.send(embed);
    }
}

module.exports = UserInfoCommand;