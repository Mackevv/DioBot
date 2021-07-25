const Command = require("../../base/Command.js");
const { MessageEmbed } = require('discord.js');
const { evaluate } = require('mathjs');

class CalcCommand extends Command {
    constructor(client) {
        super(client, {
            name: ["calculate", "calc"],
            description: "Perform a basic calculation between two or more numbers",
            botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"]
        });
    }

    run (message, args) {
        let calc = args.join(" ");
        
        if (!calc) return message.replyError("you did not specify any calculation.");

        if (calc.includes('×')) {
            calc = calc.replace('×', '*');
        } 
        if (calc.includes('x')) {
            calc = calc.replace('x', '*');
        }
        if (calc.includes('÷')) {
            calc = calc.replace('÷', '/');
        }

        let result = 0;
        try {
            result = evaluate(calc);
        } catch (e) {
            console.error(e);
            return message.replyError("this expression is not correct or contains invalid characters.");
        }
        
        const embed = new MessageEmbed()
            .defaultColor()
            .addFields(
                { name: "Calculation :", value: `\`\`\`${args.join(" ")}\`\`\`` },
                { name: "Result :", value: result }
            )
            .defaultFooter(this.options.name[0])
        ;

        message.channel.send(embed);
    }
}

module.exports = CalcCommand;