module.exports = {
  //------------| Bot Setup |------------//
  token: process.env.token,
  clientID: process.env.clientID,
  //--------------------------------------//

  //---------| Discord server Setup |--------//
  guildID: process.env.guildID,
  verifyRole: process.env.verifyRole,
  voiceCategory: process.env.voiceCategory,
  customVoice: process.env.customVoice,
  statusChannel: process.env.statusChannel,
  welcomeChannel: process.evn.welcomeChannel,
  log: process.env.log,
  //--------------------------------------//

  //-------------| Database |-------------//
  database: process.env.db,
  //--------------------------------------//,

  //-------------| API Keys |-------------//
  OpenAI_key: process.env.OpenAI_Key,
  //--------------------------------------//,
};
