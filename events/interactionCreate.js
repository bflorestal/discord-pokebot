module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		const client = require('../index.js');
		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			command.execute(interaction);
			console.log(`${interaction.user.tag} a utilisé /${interaction.commandName} dans ${interaction.guild} (#${interaction.channel.name}) à ${interaction.createdAt.toTimeString()}`);
		}
		catch (error) {
			console.error(error);
			interaction.reply({ content: `Une erreur est survenue lors de l'exécution de cette commande.`, ephemeral: true });
		}
	},
};