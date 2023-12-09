import {
  CacheType,
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  SlashCommandBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { validateEmail } from "@/lib/utils";
import {
  getEmailRoutingAddresses,
  createEmailRoutingAddress,
  createCialabsEmail,
} from "@/lib/cf";

const command = new SlashCommandBuilder()
  .setName("register")
  .setDescription("Register a username and email")
  .addStringOption((option) =>
    option.setName("username").setDescription("The username").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("email").setDescription("The email").setRequired(true)
  );

export const RegisterUser = {
  command,
  async execute(
    interaction:
      | ChatInputCommandInteraction<CacheType>
      | MessageContextMenuCommandInteraction<CacheType>
      | UserContextMenuCommandInteraction<CacheType>
  ) {
    if (
      !(
        !Array.isArray(interaction.member?.roles) &&
        interaction.member?.roles.cache.find((r) => r.name === "core")
      )
    ) {
      await interaction.reply({
        content: "You dont have enough permissions",
        ephemeral: true,
      });
      return;
    }
    const username = interaction.options.data.find(
      (v) => v.name === "username"
    )?.value;
    const email = interaction.options.data.find(
      (v) => v.name === "email"
    )?.value;

    if (!email || !validateEmail(String(email))) {
      await interaction.reply({
        content: "Invalid email format. Please provide a valid email address.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "Checking email...",
        ephemeral: true,
      });
      const response = await getEmailRoutingAddresses();
      const accounts = response.data.result;

      await interaction.reply({
        content: "Registering user...",
      });
      try {
        if (!accounts.find((acc) => acc.email === email))
          await createEmailRoutingAddress(String(email)).then(
            async (response) => {
              if (response.data.success) {
                const result = response.data.result;
                const message = `Cloudflare Verification Email sent to:${result.email}\nCheck for a email from cloudflare and verify`;
                await interaction.editReply(message);
              } else {
                const errorMessages = response.data.errors.join("\n");
                const message = `Failed to create email routing address. Errors:\n${errorMessages}`;
                await interaction.editReply(message);
              }
            }
          );

        await createCialabsEmail(String(email), `${username}@cialabs.tech`)
          .then(
            async (err) =>
              await interaction.followUp({
                content: `${username}@cialabs.tech is created`,
              })
          )
          .catch(
            async (err) =>
              await interaction.followUp({
                content: "Something went wrong " + String(err),
              })
          );
      } catch (error) {
        console.error("Error:", error);
      }
    }
  },
};
