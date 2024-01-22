import { Client, GatewayIntentBits, Partials, REST, Routes } from "discord.js";

import { RegisterUser } from "@/commands/cloudflare/register-users";
import { LinkDiscordtoCIA } from "./commands/users/link-discord";
import { ListCIAAccounts } from "./commands/users/list-users";
import {
    addPointsByDiscordUsername,
    getUserByDiscordUsername,
} from "./lib/anya/users";
import { ViewPointsCommand } from "./commands/points/show-points";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const token = process.env.DISCORD_BOT_TOKEN as string;
const clientId = String(process.env.DISCORD_CLIENT_ID) as string;

if (!token) {
    throw new Error("No token provided");
}

if (!clientId) {
    throw new Error("No client id provided");
}

const commands = [
    RegisterUser,
    // GetAccountsCommand,
    LinkDiscordtoCIA,
    ListCIAAccounts,
    ViewPointsCommand,
];

const rest = new REST({ version: "10" }).setToken(token);

try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(clientId), {
        body: commands.map((c) => c.command.toJSON()),
    });

    console.log("Successfully reloaded application (/) commands.");
} catch (error) {
    console.error(error);
}

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    for (let com of commands) {
        if (com.command.name === commandName) {
            await com.execute(interaction);
        }
    }
});

client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.partial) await reaction.fetch();

    if (reaction.emoji.name?.trim() !== "⭐") return;
    console.log("Reaction added", reaction.emoji.name);

    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.message.author?.username === user.username) return;
    if (user.partial) await user.fetch();

    const member = reaction.message.guild?.members.cache.get(user.id);
    if (
        user.username &&
        member?.roles.cache.some((role) => role.name === "core")
    ) {
        const points_receiver = reaction.message.author?.username;
        if (points_receiver) {
            await addPointsByDiscordUsername(points_receiver, 1);
            console.log("Added points to", points_receiver);
        }
    }
});

// Log in to Discord
client.login(token);
