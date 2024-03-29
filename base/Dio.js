const { Client, Intents, Collection } = require('discord.js');
const intents = new Intents([
    'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_PRESENCES',
    'GUILD_MEMBERS',
    'DIRECT_MESSAGES'
]);

const fs = require('fs');
const path = require('path');

class Dio extends Client {
    constructor() {
        super({ intents: intents });
        this.config = require('@root/config');
        this.commands = new Collection();
        this.aliases = new Collection();
        this.functions = require('@util/functions');
        this.emotes = require('@root/emotes.json');
    }

    commandLoader(commandPath, commandCategory, commandName) {
        try {
            const props = new (require(`@root/${commandPath}${path.sep}${commandName}`))(this);
            console.log(`Loading command: ${props.options.name}`);

            if (typeof props.options.aliases === 'string') {
                props.options.aliases = [props.options.aliases];
            }

            props.settings.location = commandPath;
            props.settings.category = commandCategory;

            if (props.init) {
                props.init(this);
            }

            this.commands.set(props.options.name, props);
            for (const alias of props.options.aliases) {
                this.aliases.set(alias, props.options.name);
            }

            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    }

    loadCommands = (dir) => {
        if (!dir) return console.log("Please specify the root directory for commands files");
        if (!fs.existsSync(dir)) return console.log(`There is no directory called "${dir}"`);
        if (!dir.endsWith(path.sep)) dir += path.sep;

        const categories = fs.readdirSync(path.join(path.dirname(__dirname), dir));
        for (const category of categories) {
            const files = fs.readdirSync(path.join(dir, category));
            for (const file of files) {
                const response = this.commandLoader(`${dir}${category}`, category, file);
                if (response) {
                    console.log(response);
                }
            }
        }
    }

    loadEvents = (dir) => {
        if (!dir) return console.log("Please specify the root directory for events files");
        if (!fs.existsSync(dir)) return console.log(`There is no directory called "${dir}"`);
        if (!dir.endsWith(path.sep)) dir += path.sep;

        const files = fs.readdirSync(path.join(path.dirname(__dirname), dir));
        for (const file of files) {
            const name = file.split(".")[0];
            console.log(`Loading event: ${name}`);
            const event = new (require(`@root/${dir}${path.sep}${file}`))(this);
            this.on(name, (...args) => event.run(...args));
            delete require.cache[require.resolve(`@root/${dir}${path.sep}${file}`)];
        }
    }

    validatePermissions(permissions) {
        const validPermissions = [
            'CREATE_INSTANT_INVITE',
            'KICK_MEMBERS',
            'BAN_MEMBERS',
            'ADMINISTRATOR',
            'MANAGE_CHANNELS',
            'MANAGE_GUILD',
            'ADD_REACTIONS',
            'VIEW_AUDIT_LOG',
            'PRIORITY_SPEAKER',
            'STREAM',
            'VIEW_CHANNEL',
            'SEND_MESSAGES',
            'SEND_TTS_MESSAGES',
            'MANAGE_MESSAGES',
            'EMBED_LINKS',
            'ATTACH_FILES',
            'READ_MESSAGE_HISTORY',
            'MENTION_EVERYONE',
            'USE_EXTERNAL_EMOJIS',
            'VIEW_GUILD_INSIGHTS',
            'CONNECT',
            'SPEAK',
            'MUTE_MEMBERS',
            'DEAFEN_MEMBERS',
            'MOVE_MEMBERS',
            'USE_VAD',
            'CHANGE_NICKNAME',
            'MANAGE_NICKNAMES',
            'MANAGE_ROLES',
            'MANAGE_WEBHOOKS',
            'MANAGE_EMOJIS',
        ];

        for (const permission of permissions) {
            if (!validPermissions.includes(permission)) {
                throw new Error(`Unknown permission node "${permission}"`);
            }
        }
    }
}

module.exports = Dio;