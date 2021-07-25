const Command = require('../../base/Command.js');
const { MessageEmbed } = require('discord.js');

class EmojiInfoCommand extends Command {
	constructor(client) {
		super(client, {
			name: ["emojiinfo", "emoji", "emoteinfo", "emote"],
			description: "Get information about a server emote",
			botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			guildOnly: true
		});
	}
	
	run (message, args) {
        if (!args[0]) return message.replyError("please provide an emoji.");
        
        const emoji = message.guild.emojis.cache.find(
            emoji => emoji.name === args[0] || emoji.id === args[0] || emoji == args[0].replace(/([^\d])+/gim, '')
        );
        if (!emoji) return message.replyError("emoji not found, try again with the name, id or the emoji himself.");
        
        let mention;
        let link = `https://cdn.discordapp.com/emojis/${emoji.id}`;
        
        if (emoji.animated === true) {
            mention = `<a:${emoji.name}:${emoji.id}>`;
        } else {
            mention = `<:${emoji.name}:${emoji.id}>`;
            link += ".png";
        }
        
        const embed = new MessageEmbed()
            .defaultColor()
            .setTitle("Emoji Info")
            .setDescription(`You can download this emoji by clicking [here](${link})`)
            .addFields(
                { name: 'Emoji :', value: `${emoji}`, inline: false},
                { name: 'Name :', value: `\`${emoji.name}\``, inline: false },
                { name: 'ID :', value: `\`${emoji.id}\``, inline: false },
                { name: 'Identifier :', value: `\`${mention}\``, inline: false},
                { name: 'Creation date :', value: `\`${this.client.functions.formatDate(emoji.createdAt)}\``, inline: false}
            )
            .defaultFooter(this.options.name[0])
        ;
        
        message.channel.send(embed);
	}
}

module.exports = EmojiInfoCommand;