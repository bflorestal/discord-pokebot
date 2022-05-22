module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`C'est bon ! Connecté en tant que ${client.user.tag}.`);
	},
};