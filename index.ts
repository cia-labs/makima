import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';

import { createCialabsEmail, createEmailRoutingAddress, getEmailRoutingAddresses } from './cf';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const token = process.env.TOKEN as string;
const clientId = String(process.env.CLIENT) as string;


const ping = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('test command to ping back');


const getUserAccounts = new SlashCommandBuilder()
    .setName('list-accounts')
    .setDescription('Lists all cialabs accounts');

const registerUser = new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register a username and email')
    .addStringOption(option =>
        option.setName('username')
            .setDescription('The username')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('email')
            .setDescription('The email')
            .setRequired(true));

const commands = [
    ping,
    registerUser,
    getUserAccounts
].map(c => c.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(clientId), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.error(error);
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
        await interaction.reply('Pong!');
    } else if (commandName === 'echo') {
        const val = options.data.find(v => v.name === 'input')?.value
        await interaction.reply(String(val) ?? "no input");
    } else if (commandName === 'register') {
        if (!(!Array.isArray(interaction.member?.roles) && interaction.member?.roles.cache.find(r => r.name === 'core'))) {

            await interaction.reply('You dont have enough permissions');
            return
        }
        const username = options.data.find(v => v.name === 'username')?.value
        const email = options.data.find(v => v.name === 'email')?.value

        if (!email || !validateEmail(String(email))) {
            await interaction.reply('Invalid email format. Please provide a valid email address.');
        }
        else {

            await interaction.reply('Checking email...');
            const response = await getEmailRoutingAddresses();
            const accounts = response.data.result;

            await interaction.editReply('Registering user...');
            try {
                if (!accounts.find(acc => acc.email === email))
                    await createEmailRoutingAddress(
                        String(email)
                    ).then(async response => {
                        if (response.data.success) {
                            const result = response.data.result;
                            const message = `Cloudflare Verification Email sent to:${result.email}\nCheck for a email from cloudflare and verify`;
                            await interaction.editReply(message);
                        } else {
                            const errorMessages = response.data.errors.join('\n');
                            const message = `Failed to create email routing address. Errors:\n${errorMessages}`;
                            await interaction.editReply(message);
                        }
                    })

                await createCialabsEmail(
                    String(email), `${username}@cialabs.tech`
                )
                    .then(async err => await interaction.followUp({ content: `${username}@cialabs.tech is created`, ephemeral: true }))
                    .catch(async err => await interaction.followUp({ content: "Something went wrong " + String(err), ephemeral: true }));

            } catch (error) {
                console.error('Error:', error);
            }
        }
    } else if (commandName === 'list-accounts') {
        try {
            const response = await getEmailRoutingAddresses();
            const accounts = response.data.result;
            await interaction.reply(`fetching list of accounts`);
            if (accounts.length === 0) {
                await interaction.editReply('No accounts found.');
            } else {
                const accountList = accounts.map(account => `Tag: ${account.tag}, Email: ${account.email}`).join('\n');
                await interaction.editReply(`List of accounts:\n${accountList}`);
            }
        } catch (error) {
            console.error('Error fetching accounts:', error);
            await interaction.editReply('An error occurred while fetching accounts.');
        }
    }
});

// Log in to Discord
client.login(token);

function validateEmail(email: string) {
    // Regular expression for a basic email format validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
}
