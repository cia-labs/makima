import { getUser, updateUser } from "@/lib/anya/users";
import {
  CacheType,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";

const command = new SlashCommandBuilder()
  .setName("link-discord")
  .setDescription("Link your discord to cialabs account")
  .addStringOption((option) =>
    option.setName("username").setDescription("CIA Username").setRequired(true),
  );

export const LinkDiscordtoCIA = {
  command,
  async execute(
    interaction:
      | ChatInputCommandInteraction<CacheType>
      | MessageContextMenuCommandInteraction<CacheType>
      | UserContextMenuCommandInteraction<CacheType>,
  ) {
    await interaction.deferReply();
    const username = interaction.options.data.find(
      (option) => option.name === "username",
    )?.value as string;

    if (!username) {
      console.log("No username provided");
      await interaction.reply({
        content: "You need to provide a username",
        ephemeral: true,
      });
      return;
    }

    console.log("Linking discord to cia", username);

    try {
      const user = await getUser(username);
      if (!(user && user[0].username)) {
        await interaction.reply({
          content: `No user with username ${username}`,
          ephemeral: true,
        });
        return;
      }
      await updateUser(username, {
        discord_username: interaction.user.username,
      });
      console.log("Successfully linked discord to cia", username);
      await interaction.editReply({
        content: `Successfully linked your discord ${interaction.user.username} to ${username}`,
      });
    } catch (error) {
      console.error("Error linking discord to cia", username, error);
      await interaction.reply({
        content: `Failed to link your discord to ${username}`,
        ephemeral: true,
      });
    }
  },
};
