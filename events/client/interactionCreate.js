const errorEmbed = require('../../functions/discord/errorEmbed');
const discord = require('discord.js');

module.exports = async (discord, client, interaction) => {
  const interactionOptions = interaction.options._hoistedOptions;
  if (interaction.isChatInputCommand() === true) {
    await interaction.reply({
      content: "Processing... Please hold."
    });
    const guildID = interaction.guildId;
    const cmd = interaction.commandName;
    const command = await client.commands.get(cmd);
    const guild = client.guilds.cache.get(guildID);
    const channel = guild.channels.cache.get(interaction.channelId);
    if (channel === undefined) return;
    let args = [];
    for (const option of interactionOptions) { // Pull args from interaction options
      args.push(option.value);
    }
    // Setting up all potentially needed request information
    try {
      const channel = await guild.channels.cache.get(interaction.channelId);
      // Making it more "restful"
      let req = {};
      req.interaction = interaction;
      req.args = args;
      req.cmd = cmd;
      req.client = client;
      req.discord = discord;
      req.guild = guild;
      req.channel = channel;
      command.execute(req);
    } catch (err) {
      console.log(err);
      return errorEmbed(channel, 'There was an error trying to execute this command.');
    }
  }
}


// Interaction Example Case
/*
ChatInputCommandInteraction {
  type: 2,
  id: '1016015747857780856',
  applicationId: '845784381025157131',
  channelId: '865492838526746624',    
  guildId: '799685703910686720',      
  user: User {
    id: '163335405712703488',
    bot: false,
    system: false,
    flags: UserFlagsBitField { bitfield: 128 },
    username: 'POPINxxCAPS',
    discriminator: '5030',
    avatar: 'ce260a16d18fa90c58360bae6c4f214f',
    banner: undefined,
    accentColor: undefined
  },
  member: GuildMember {
    guild: Guild {
      id: '799685703910686720',
      name: 'Cosmic Network || SE',
      icon: '8a67124fd95d1bc7b0c6b1840ac3ba52',
      features: [Array],
      commands: [GuildApplicationCommandManager],
      members: [GuildMemberManager],
      channels: [GuildChannelManager],
      bans: [GuildBanManager],
      roles: [RoleManager],
      presences: PresenceManager {},
      voiceStates: [VoiceStateManager],
      stageInstances: [StageInstanceManager],
      invites: [GuildInviteManager],
      scheduledEvents: [GuildScheduledEventManager],
      available: true,
      shardId: 0,
      splash: 'fbcfc6546a5f1703b7ba6bc83fd9279c',
      banner: null,
      description: null,
      verificationLevel: 3,
      vanityURLCode: null,
      nsfwLevel: 0,
      premiumSubscriptionCount: 2,
      discoverySplash: null,
      memberCount: 286,
      large: true,
      premiumProgressBarEnabled: false,
      applicationId: null,
      afkTimeout: 300,
      afkChannelId: null,
      systemChannelId: '799942788623237122',
      premiumTier: 1,
      widgetEnabled: null,
      widgetChannelId: null,
      explicitContentFilter: 2,
      mfaLevel: 1,
      joinedTimestamp: 1630407850953,
      defaultMessageNotifications: 1,
      systemChannelFlags: [SystemChannelFlagsBitField],
      maximumMembers: 500000,
      maximumPresences: null,
      maxVideoChannelUsers: 25,
      approximateMemberCount: null,
      approximatePresenceCount: null,
      vanityURLUses: null,
      rulesChannelId: '799685786983071756',
      publicUpdatesChannelId: '852439570800967691',
      preferredLocale: 'en-US',
      ownerId: '163335405712703488',
      emojis: [GuildEmojiManager],
      stickers: [GuildStickerManager]
    },
    joinedTimestamp: 1610730329262,
    premiumSinceTimestamp: null,
    nickname: null,
    pending: false,
    communicationDisabledUntilTimestamp: null,
    _roles: [
      '799945900465586193',
      '977700454777651250',
      '1007585064495890435',
      '799686409468117062'
    ],
    user: User {
      id: '163335405712703488',
      bot: false,
      system: false,
      flags: [UserFlagsBitField],
      username: 'POPINxxCAPS',
      discriminator: '5030',
      avatar: 'ce260a16d18fa90c58360bae6c4f214f',
      banner: undefined,
      accentColor: undefined
    },
    avatar: null
  },
  version: 1,
  appPermissions: PermissionsBitField { bitfield: 4398046511103n },
  memberPermissions: PermissionsBitField { bitfield: 4398046511103n },
  locale: 'en-US',
  guildLocale: 'en-US',
  commandId: '1016004941556486186',
  commandName: 'ping',
  commandType: 1,
  commandGuildId: '799685703910686720',
  deferred: false,
  replied: false,
  ephemeral: null,
  webhook: InteractionWebhook { id: '845784381025157131' },
  options: CommandInteractionOptionResolver {
    _group: null,
    _subcommand: null,
    _hoistedOptions: []
  }
}
*/