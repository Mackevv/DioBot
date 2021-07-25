const Command = require("@base/Command.js");

class BanCommand extends Command {
	constructor(client) {
		super(client, {
			name: "ban",
			description: "Ban a user from the guild",
			permissions: "BAN_MEMBERS",
			botPermissions: ["SEND_MESSAGES", "BAN_MEMBERS"]
		});
	}

	async run (message, args) {
		if (!args[0]) {
			return message.replyError("please provide someone to ban.");
		}

		let reason = `Banned by ${message.author.tag}`;
		const reasonBool = args[1] ? true : false;
		if (args[1]) {
			reason = args.splice(1).join(" ");
		}

		const targetUser = await this.client.functions.getUser(args[0], this.client);

		if (!targetUser) return message.replyError("please provide a valid member mention, id or tag.");
		if (targetUser.id === message.author.id) return message.replyError("you cannot ban yourself.");
		if (targetUser.id === this.client.user.id) {
			return message.channel.send("https://media.giphy.com/media/rOTI83tAUEyHpJuy2p/giphy.gif").then((msg) => {
				setTimeout(() => {
					msg.delete();
				}, 6000);
			})
		}

		// Verify if the message author has a higher role than the target user
		const member = await message.guild.members.fetch(targetUser.id).catch(e => console.error(e));
		if (member) {
			const targerUserRolePos = member.roles.highest.position;
			const authorRolePos = message.member.roles.highest.position;
			if (message.guild.ownerID !== message.author.id && !(authorRolePos > targerUserRolePos)) {
				return message.replyError("you cannot ban a member with a higher or equal role than you.");
			}

			if (!member.bannable) {
				return message.error(`I Dio, cannot ban user **${targetUser.tag}**.`);
			}
		}

		if (reasonBool) {
			await targetUser.send(`You were banned from **${message.guild.name}** for the following reason : ${reason}.`)
				.catch((e) => console.error(e));
		} else {
			await targetUser.send(`You were banned from **${message.guild.name}**.`)
				.catch((e) => console.error(e));
		}

		message.guild.members.ban(targetUser, { reason }).then(() => {
			message.success(`**${targetUser.tag}** was successfully banned.`);
		}).catch((e) => {
			message.error(`I Dio, cannot ban user **${targetUser.tag}**.`);
			console.error(e);
		});
	}

}

module.exports = BanCommand;