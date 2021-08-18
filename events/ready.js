module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run() {
        const activities = [
            'Stand name : The World',
            'Stand user : Dio Brando',
            `${this.client.guilds.cache.size} server | ${this.client.config.prefix}help`
        ];
        setInterval(() => {
            const activity = activities[Math.floor(Math.random() * activities.length)];
            this.client.user.setPresence({
                status: 'online',
                activities: [{
                    name: activity,
                    type: 'WATCHING',
                }]
            });
        }, 15000);
    }
}