const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

// Fonction qui récupère la liste des types dans l'API
const getTypes = async () => {
	try {
		const response = await axios.get(`https://pokeapi.co/api/v2/type`);
		const { data } = response;

		return data;
	}
	catch (err) {
		console.error(err);
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('types')
		.setDescription(`Liste des types`),

	async execute(interaction) {
		// Récupère l'utilisateur ayant effectué la commande
		const intUser = interaction.user;

		// Récupère la liste des types de l'API
		const types = await getTypes();
		const listOfTypes = types.results.map(type => type.name);

		console.log("types", types);
		console.log("listOfTypes", listOfTypes);

		// Embed
		const embed = new MessageEmbed()
		.setColor('#1E90FF')
		.setAuthor({ name: `Liste des types (${types.count})` })
		.setDescription(listOfTypes.map((l) => l.charAt(0).toUpperCase() + l.substr(1)).join(", "))
		.setTimestamp()
		.setFooter({ text: `Demandé par ${intUser.tag}`, iconURL: intUser.avatarURL({ dynamic: true }) });

		await interaction.reply({ embeds: [embed] });
	},
};