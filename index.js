const { Client, GatewayIntentBits, PermissionsBitField, Partials } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const prefix = "!";

const WELCOME_CHANNEL = process.env.WELCOME_CHANNEL;
const AUTO_ROLE = process.env.AUTO_ROLE;
const TOKEN = process.env.TOKEN;

const filterWords = ["badword", "curse"];

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("guildMemberAdd", member => {
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL);
  if (channel) {
    channel.send(`Welcome to the server, ${member.user}!`);
  }
  const role = member.guild.roles.cache.get(AUTO_ROLE);
  if (role) {
    member.roles.add(role);
  }
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  for (let word of filterWords) {
    if (message.content.toLowerCase().includes(word)) {
      await message.delete();
      return message.channel.send(`${message.author}, that word is not allowed here.`);
    }
  }

  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    message.channel.send("Pong!");
  }

  if (command === "help") {
    message.channel.send("**DemonBOT Commands:**\n!ping\n!stream\n!say <msg>\n!ticket\n!filter");
  }

  if (command === "stream") {
    message.channel.send("Watch my stream live on Aparat: https://aparat.com/TheArashDemon/live");
  }

  if (command === "say") {
    const msg = args.join(" ");
    if (!msg) return;
    message.channel.send(msg);
  }

  if (command === "ticket") {
    const ticketChannel = await message.guild.channels.create({
      name: `ticket-${message.author.username}`,
      type: 0,
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
          id: message.author.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        }
      ]
    });
    ticketChannel.send(`Hello ${message.author}, support will be with you shortly.`);
    message.reply(`Ticket created: ${ticketChannel}`);
  }

  if (command === "filter") {
    message.channel.send("Blocked words: " + filterWords.join(", "));
  }
});

client.login(TOKEN);
