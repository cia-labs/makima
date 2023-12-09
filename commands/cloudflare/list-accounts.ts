import { CacheType, ChatInputCommandInteraction, MessageContextMenuCommandInteraction, SlashCommandBuilder, UserContextMenuCommandInteraction } from "discord.js";
import { getEmailRoutingAddresses } from "@/lib/cf";

const command = new SlashCommandBuilder()
    .setName('users')
    .setDescription('Lists all cialabs accounts');

export const GetAccountsCommand = {
    command,
    async execute(interaction: ChatInputCommandInteraction<CacheType> | MessageContextMenuCommandInteraction<CacheType> | UserContextMenuCommandInteraction<CacheType>) {
        try {
            const response = await getEmailRoutingAddresses();
            const accounts = response.data.result;
            await interaction.reply(`fetching list of accounts`);
            if (accounts.length === 0) {
                await interaction.editReply('No accounts found.');
            } else {
                const accountList = accounts.map(account => `- ${account.email} ${account.verified ? '✅' : '❌'}`).join('\n');
                await interaction.editReply(`List of accounts:\n${accountList}`);
            }
        } catch (error) {
            console.error('Error fetching accounts:', error);
            await interaction.editReply('An error occurred while fetching accounts.');
        }
    }
}