const Command = require('@base/Command');
const util = require('util');

const clean = (text) => {
    if (typeof (text) === "string") {
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    } else {
        return text;
    }
}

class EvalCommand extends Command {
    constructor(client) {
        super(client, {
            name: "eval"
        });
    }

    run(message, args) {
        try {
            let evaled = eval(args.join(" "));

            if (typeof evaled !== "string") {
                evaled = util.inspect(evaled);
            }

            message.channel.send(clean(evaled), { code: "xl" });

        } catch (e) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(e)}\n\`\`\``);
        }
    }
}

module.exports = EvalCommand;