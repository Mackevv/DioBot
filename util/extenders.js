const { Message, MessageEmbed } = require('discord.js');
const config = require('../config');

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