import {
  CacheType,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { getEmailRoutingAddresses } from "@/lib/cf";

const command = new SlashCommandBuilder()
  .setName("users")
  .setDescription("Lists all cialabs accounts");

export const GetAccountsCommand = {
  command,
  async execute(
    interaction:
      | ChatInputCommandInteraction<CacheType>
      | MessageContextMenuCommandInteraction<CacheType>
      | UserContextMenuCommandInteraction<CacheType>,
  ) {
    try {
      const response = await getEmailRoutingAddresses();
      const accounts = response.data.result;

      if (accounts.length === 0) {
        await interaction.reply("No accounts found.");
      } else {
        const accountList = accounts
          .map((e) => e.matchers.find((m) => m.field === "to")?.value)
          .filter((v) => v)
          .join("\n");

        await interaction.reply({
          content: `## Users\n${accountList}`,
        });
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      await interaction.reply("An error occurred while fetching accounts.");
    }
  },
};
