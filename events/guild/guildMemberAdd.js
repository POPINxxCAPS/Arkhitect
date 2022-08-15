module.exports = async(client, discord, member) => {
  if(member.guild.id !== '849892492039290920') return;
  let welcomeRole = await member.guild.roles.cache.find(role => role.id === '849896694837542932')
  member.roles.add(welcomeRole);
  let channel = member.guild.channels.cache.get('849894312644313109');
  channel.send(`Welcome to the discord <@${member.user.id}>.`);
  console.log(`Role given to new member`);
};