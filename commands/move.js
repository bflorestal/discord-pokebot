const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

// Fonction qui récupère les données d'une attaque dans l'API
const getMove = async (move) => {
	try {
		const response = await axios.get(`https://pokeapi.co/api/v2/move/${move}`);
		const { data } = response;

		return data;
	}
	catch (err) {
		console.error(err);
	}
};

// Ajoute une majuscule à la catégorie et au type
const nameFormat = (name) => {
    return name
		.split(" ")
		.map((l) => l.charAt(0).toUpperCase() + l.substr(1))
		.join(" ");
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription(`Chercher une attaque`)
		.addStringOption(option =>
		option.setName('search')
			.setDescription(`Le nom de l'attaque`)
			.setRequired(true)),

	async execute(interaction) {
		// Récupère l'utilisateur ayant effectué la commande
		const intUser = interaction.user;

		// Récupère le nom de l'attaque recherchée
		const searchedMove = interaction.options.getString('search').toLowerCase().split(" ").join("-");
		// Récupère les données de l'API sur cette attaque
		const move = await getMove(searchedMove);

		// Embed
		const embed = new MessageEmbed()
		.setColor('#1E90FF')
		.setAuthor({ name: move.names[3].name })
		// Apparition, catégorie et type
		.addFields(
			{ name: `Apparition`, value: `${move.generation.name}`, inline: true },
			{ name: `Catégorie`, value: `${nameFormat(move.damage_class.name)}`, inline: true },
			{ name: `Type`, value: `${nameFormat(move.type.name)}`, inline: true },
		)
		.addFields(
			// Précision, puissance, PP, priorité
			{ name: `🎯 Précision`, value: `${move.accuracy} %`, inline: true },
			{ name: `💪 Puissance`, value: `${move.power}`, inline: true },
			{ name: `🔋 PP`, value: `${move.pp}`, inline: true },
			{ name: `⌛ Priorité`, value: `${move.priority}`, inline: true },
		)
		.setTimestamp()
		.setFooter({ text: `Demandé par ${intUser.tag}`, iconURL: intUser.avatarURL({ dynamic: true }) });

		await interaction.reply({ embeds: [embed] });
	},
};