import { listUsers } from "@/lib/anya/users";

import {
  CacheType,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";

const command = new SlashCommandBuilder()
  .setName("users")
  .setDescription("Lists all cialabs accounts");

export const ListCIAAccounts = {
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

    await interaction.guild?.members.fetch();
    console.log("feetched guild users");
    await listUsers().then((users) => {
      users = users.filter((user) => user.username !== "admin");
      type UsersByRole = Record<string, typeof users>;

      console.log("grouping users by role");
      // Group users by role
      const usersByRole = users.reduce<UsersByRole>((acc, user) => {
        user.role = user.role || "npc";
        if (!acc[user.role]) {
          acc[user.role] = [];
        }
        acc[user.role].push(user);
        return acc;
      }, {});

      console.log("creating markdown message");
      // Create a markdown formatted message
      const markdownMessage = Object.entries(usersByRole)
        .map(([role, usersInRole]) => {
          const userLines = usersInRole
            .map((user) => {
              const user_id = interaction.guild?.members.cache.find(
                (m) => m.user.username === user.discord_username,
              )?.id;
              if (user_id)
                return `### **${user.username}**\n${user.email}\ndiscord: ${user.discord_username ? `<@${user_id}>` : "Not linked"}`;
              return `### **${user.username}**\n${user.email}\ndiscord: ${user.discord_username ? `@${user.discord_username}` : "Not linked"}`;
            })
            .join("\n\n");
          return `## **${role}**\n${userLines}`;
        })
        .join("\n\n");

      interaction.editReply({
        content: `# **Users**\n${markdownMessage}`,
        options: {
          ephemeral: true,
        },
      });
    });
  },
};
