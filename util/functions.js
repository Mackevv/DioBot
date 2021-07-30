module.exports = {
    async getUser(string, client) {
        if (!string || typeof string !== 'string') return;

        let user = client.users.cache.get(string)
            || client.users.cache.find(u => u.tag === string);

        const mentionExp = string.match(/^<@!?(\d+)>$/);

        if (mentionExp) {
            user = client.users.cache.get(mentionExp[1]);
            return user;
        }

        return user;
    },

    async getMember(string, guild) {
        if (!string || typeof string !== 'string') return;

        guild = await guild.fetch();

        let member = guild.members.cache.get(string)
            || guild.members.cache.find(m => m.user.tag === string);

        const mentionExp = string.match(/^<@!?(\d+)>$/);

        if (mentionExp) {
            member = guild.members.cache.get(mentionExp[1]);
            return member;
        }

        return member;
    },

    formatDate(d) {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        const days = [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat'
        ];

        const year = d.getFullYear();
        const month = months[d.getMonth()];
        const day = days[d.getDay()];
        const date = d.getDate();
        const hours = ('0' + d.getHours()).slice('-2');
        const minutes = ('0' + d.getMinutes()).slice('-2');
        const seconds = ('0' + d.getSeconds()).slice('-2');

        return `${day}, ${date} ${month} ${year} at ${hours}:${minutes}:${seconds}`
    },

    ucfirst(string) {
        if (!string || typeof string !== 'string') return;
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    help(string, options = {}) {
        if (!string || typeof string !== 'string') return;
        if (options) {
            for (const option in options) {
                const optionExp = new RegExp(`{{${option}}}`, 'g');
                string = string.replace(optionExp, options[option]);
            }
        }
        return string;
    }
}