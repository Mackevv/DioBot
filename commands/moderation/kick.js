const Command = require("@base/Command.js");

class KickCommand extends Command {
    constructor(client) {
        super(client, {
            name: "kick",
            description: "Kick a user from the guild",
            permissions: "KICK_MEMBERS",
            botPermissions: ["SEND_MESSAGES", "KICK_MEMBERS"]
        });
    }

    async run(message, args) {
        if (!args[0]) {
            return message.replyError("please provide someone to kick.");
        }

        let reason = `Kicked by ${message.author.tag}`;
        const reasonBool = args[1] ? true : false;
        if (args[1]) {
            reason = args.splice(1).join(" ");
        }

        const targetMember = await this.client.functions.getMember(args[0], message.guild);

        if (!targetMember) return message.replyError("please provide a valid member mention, id or tag.");
        if (targetMember.id === message.author.id) return message.replyError("you cannot kick yourself.");
        if (targetMember.id === this.client.user.id) {
            return message.channel.send("https://media.giphy.com/media/rOTI83tAUEyHpJuy2p/giphy.gif").then((msg) => {
                setTimeout(() => {
                    msg.delete();
                }, 6000);
            });
        }

        // Verify if the message author has a higher role than the target user
        const targetMemberRolePos = targetMember.roles.highest.position;
        const authorRolePos = message.member.roles.highest.position;
        if (message.guild.ownerId !== message.author.id && !(authorRolePos > targetMemberRolePos)) {
            return message.replyError("you cannot kick a member with a higher or equal role than you.");
        }

        if (!targetMember.kickable) {
            return message.error(`I Dio, cannot kick user **${targetMember.user.tag}**.`)
        }

        if (reasonBool) {
            await targetMember.send(`You were kicked from **${message.guild.name}** for the following reason : ${reason}.`).catch((e) => console.error(e));
        } else {
            await targetMember.send(`You were kicked from **${message.guild.name}**.`).catch((e) => console.error(e));
        }

        targetMember.kick(reason).then(() => {
            message.success(`**${targetMember.user.tag}** was successfully kicked.`);
        }).catch((e) => {
            message.error(`I Dio, cannot kick user **${targetMember.user.tag}**.`);
            console.error(e);
        });
    }

}

module.exports = KickCommand;