import {
  CacheType,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { getEmailRoutingAddresses } from "@/lib/cf";

const command = new SlashCommandBuilder()
  .setName("cf-users")
  .setDescription("Lists all cialabs emails");

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
      const emails = response.data.result
        .map((e) => e.matchers.find((m) => m.field === "to")?.value)
        .filter((v) => v) as string[];

      const subdomains = new Map<string, string[]>();

      // Group emails by subdomain or the main domain
      emails.forEach((email) => {
        let subdomain = "core"; // Default group for main domain emails
        const subregex = new RegExp("@(.+)\\.cialabs\\.tech$");
        const match = email.match(subregex);

        if (match) {
          subdomain = match[1];
        }

        if (!subdomains.has(subdomain)) {
          subdomains.set(subdomain, []);
        }
        subdomains.get(subdomain)?.push(email);
      });

      // Format the output
      let replyContent = "";
      subdomains.forEach((emails, subdomain) => {
        const label =
          subdomain === "core"
            ? "Core"
            : subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
        replyContent += `## ${label} (${emails.length} Users)\n`;
        replyContent += emails.join("\n");
        replyContent += "\n\n"; // Separate each subdomain section
      });

      if (replyContent === "") {
        await interaction.reply("No accounts found.");
      } else {
        await interaction.reply({ content: replyContent });
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      await interaction.reply("An error occurred while fetching accounts.");
    }
  },
};
