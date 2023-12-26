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
  getEmailRoutingDestinationAddresses,
} from "@/lib/cf";

const command = new SlashCommandBuilder()
  .setName("register")
  .setDescription("Register a username and email")
  .addStringOption((option) =>
    option
      .setName("username")
      .setDescription("This will be used as <username>@<role>.cialabs.tech")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("email")
      .setDescription(
        "Your personal gmail that all ur cia mails need to be sent to",
      )
      .setRequired(true),
  );

const allowed_roles = ["core", "student"];
const admin_roles = ["core"];

export const RegisterUser = {
  command,
  async execute(
    interaction:
      | ChatInputCommandInteraction<CacheType>
      | MessageContextMenuCommandInteraction<CacheType>
      | UserContextMenuCommandInteraction<CacheType>,
  ) {
    if (
      !(
        !Array.isArray(interaction.member?.roles) &&
        interaction.member?.roles.cache.find((r) =>
          allowed_roles.includes(r.name),
        )
      )
    ) {
      await interaction.reply({
        content: "You dont have enough permissions",
        ephemeral: true,
      });
      return;
    }
    const role = interaction.member?.roles.cache.find((r) =>
      allowed_roles.includes(r.name),
    );

    const username = interaction.options.data.find((v) => v.name === "username")
      ?.value;
    const email = interaction.options.data.find((v) => v.name === "email")
      ?.value;

    if (!email || !validateEmail(String(email))) {
      await interaction.reply({
        content: "Invalid email format. Please provide a valid email address.",
        ephemeral: true,
      });
      return;
    } else {
      await interaction.reply({
        content: "Checking email...",
        ephemeral: true,
      });
      const response = await getEmailRoutingDestinationAddresses();
      const accounts = response.data.result;

      await interaction.editReply({
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
            },
          );

        const result_email = (
          admin_roles.includes(role?.name!)
            ? `${username}@cialabs.tech`
            : `${username}@${role?.name}.cialabs.tech`
        )
          .trim()
          .toLowerCase()
          .replaceAll(" ", ".");

        console.log(result_email);

        await createCialabsEmail(String(email), result_email)
          .then(async () => {
            await interaction.followUp({
              content: `${result_email} is created, to add the email to ur gmail you can refer to https://community.cloudflare.com/t/solved-how-to-use-gmail-smtp-to-send-from-an-email-address-which-uses-cloudflare-email-routing/382769/2\nThis step is totally optional and is only so you can send emails as this new email id`,
            });

            await interaction.followUp({
              content: `Once you have verified your email (${String(
                email,
              )}) you will receive all mails sent to ${result_email} will be forwarded to ${String(
                email,
              )}`,
            });
          })
          .catch(
            async (err) =>
              await interaction.followUp({
                content: "Something went wrong " + String(err),
              }),
          );
      } catch (error) {
        console.error("Error:", error);
      }
    }
  },
};
