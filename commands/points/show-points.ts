import { getUserByDiscordUsername } from "@/lib/anya/users";
import {
  CacheType,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";

const command = new SlashCommandBuilder()
  .setName("show-stars")
  .setDescription("View your points");

export const ViewPointsCommand = {
  command,
  async execute(
    interaction:
      | ChatInputCommandInteraction<CacheType>
      | MessageContextMenuCommandInteraction<CacheType>
      | UserContextMenuCommandInteraction<CacheType>,
  ) {
    await interaction.deferReply({
      ephemeral: true,
    });
    const users = await getUserByDiscordUsername(interaction.user.username);
    const user = users[0];
    if (user) {
      await interaction.editReply({
        content: `You have ${user.points} Stars`,
        options: {
          ephemeral: true,
        },
      });
      return;
    }
    await interaction.editReply({
      content: `You dont exist`,
      options: {
        ephemeral: true,
      },
    });
  },
};
