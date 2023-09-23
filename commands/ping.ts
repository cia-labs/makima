import { SlashCommandBuilder } from "discord.js";

export const PingCommand = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('test command to ping back');

