const { Message, MessageEmbed } = require('discord.js');
const config = require('../config');
const emotes = require('../emotes');

// Add custom success and error message with prefix emote
Message.prototype.success = function(content) {
    const emote = emotes.checkmark;
    return this.channel.send(`${emote} ${content}`);
}

Message.prototype.error = function(content) {
    const emote = emotes.wrongmark;
    return this.channel.send(`${emote} ${content}`);
}

Message.prototype.replySuccess = function(content) {
    const emote = emotes.checkmark;
    return this.channel.send(`${emote} **${this.author.username}**, ${content}`);
}

Message.prototype.replyError = function(content) {
    const emote = emotes.wrongmark;
    return this.channel.send(`${emote} **${this.author.username}**, ${content}`);
}

// Add shortcut methods for default embed configuration
MessageEmbed.prototype.defaultColor = function() {
    this.setColor(config.embed.color);
    return this;
}

MessageEmbed.prototype.successColor = function() {
    this.setColor(config.embed.successColor);
    return this;
}

MessageEmbed.prototype.errorColor = function() {
    this.setColor(config.embed.errorColor);
    return this;
}

MessageEmbed.prototype.defaultFooter = function(commandName) {
    this.setFooter(`DioBot | ${config.prefix}${commandName}`);
    return this;
}