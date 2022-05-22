const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

// Fonction qui récupère les données d'un Pokémon dans l'API
const getPokemon = async (pkmn) => {
	try {
		const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pkmn}`);
		const { data } = response;

		return data;
	}
	catch (err) {
		console.error(err);
	}
};

// Réécrit correctement le nom du Pokémon, et les statistiques
const nameFormat = (name) => {
	if (name === "hp") return "HP";
    return name
		.split("-")
		.map((l) => l.charAt(0).toUpperCase() + l.substr(1))
		.join(" ");
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pokemon')
		.setDescription(`Chercher un Pokémon`)
		.addStringOption(option =>
		option.setName('search')
			.setDescription(`Le nom du Pokémon`)
			.setRequired(true)),

	async execute(interaction) {
		// Récupère l'utilisateur ayant effectué la commande
		const intUser = interaction.user;

		// Récupère le nom du Pokémon recherché
		const searchedPkmn = interaction.options.getString('search').toLowerCase();
		// Récupère les données de l'API sur ce Pokémon
		const pokemon = await getPokemon(searchedPkmn);

		// Embed
		const embed = new MessageEmbed()
		.setColor('#1E90FF')
		.setAuthor({ name: nameFormat(pokemon.name) })
		.setThumbnail(pokemon.sprites.front_default)
		.addFields(
			// Poids et taille
			{ name: `⚖️ Poids`, value: `${pokemon.weight / 10} kg`, inline: true },
			{ name: `📏 Taille`, value: `${pokemon.height / 10} m`, inline: true },
		)
		.setTimestamp()
		.setFooter({ text: `Demandé par ${intUser.tag}`, iconURL: intUser.avatarURL({ dynamic: true }) });
		// Type(s)
		const types = pokemon.types.map(e => e.type.name);
		const listOfTypes = types.map((l) => l.charAt(0).toUpperCase() + l.substr(1)).join(", ");

		embed.addField(`🗂️ Type(s)`, `${listOfTypes}`);

		// Statistiques
		const stats = pokemon.stats;
		console.log(stats);

		stats.map(e => embed.addField(`${nameFormat(e.stat.name)}`, `${e.base_stat}`, true));

		await interaction.reply({ embeds: [embed] });
	},
};