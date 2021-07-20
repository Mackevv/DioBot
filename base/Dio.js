const { Client, Intents, Collection } = require('discord.js');
const intentsList = [
    'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_PRESENCES',
    'GUILD_MEMBERS',
    'DIRECT_MESSAGES'
];
const intents = new Intents(intentsList);

const fs = require('fs');
const path = require('path');

class Dio extends Client {
    constructor() {
        super({
            ws: { intents: intents }
        });
        this.config = require('../config');
        this.commands = new Collection();
    }

    commandLoader(commandPath, commandCategory, commandName) {
        try {
            const props = new (require(`../${commandPath}${path.sep}${commandName}`))(this);

            if (typeof props.options.name === 'string') {
                props.options.name = [props.options.name];
            }
            
            console.log(`Loading command: ${props.options.name[0]}`);
            
            props.settings.location = commandPath;
            props.settings.category = commandCategory;
            
            if (props.init) {
                props.init(this);
            }
            
            for (const alias of props.options.name) {
                this.commands.set(alias, props);
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
            const event = new (require(`../${dir}${path.sep}${file}`))(this);
            this.on(name, (...args) => event.run(...args));
            delete require.cache[require.resolve(`../${dir}${path.sep}${file}`)];
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