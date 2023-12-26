import { Client, GatewayIntentBits, REST, Routes } from "discord.js";

import { RegisterUser } from "@/commands/cloudflare/register-users";
import { GetAccountsCommand } from "@/commands/cloudflare/list-accounts";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const token = process.env.DISCORD_BOT_TOKEN as string;
const clientId = String(process.env.DISCORD_CLIENT_ID) as string;

const commands = [RegisterUser, GetAccountsCommand];

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

// Log in to Discord
client.login(token);
