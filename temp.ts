import { eq } from "drizzle-orm";
import { db } from "./lib/db";
import { user } from "./lib/db/schema";
import { auth } from "./lib/anya/auth";
import { getEmailRoutingAddresses } from "./lib/cf";
import { getUserByDiscordUsername, registerUser } from "./lib/anya/users";

// auth
//   .createUser({
//     attributes: {
//       username: "admin",
//     },
//     key: {
//       providerUserId: "admin",
//       providerId: "manual",
//       password: "makima_admin",
//     },
//   })
//   .then((user) => {
//     console.log(user);
//   });

// process.env.ADMIN_PASSWORD &&
//   auth
//     .updateKeyPassword("manual", "admin", process.env.ADMIN_PASSWORD)
//     .then((user) => {
//       console.log("updated key", user);
//       auth
//         .useKey("manual", "admin", process.env.ADMIN_PASSWORD!)
//         .then((user) => {
//           console.log(user);
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     });
//

// auth.useKey("manual", "admin", "admin0617").then((user) => {
//   console.log(user);
//   auth.getUser(user.userId).then((user) => {
//     console.log(user);
//   });
// });

// await db
//   .update(user)
//   .set({ discord_username: "xrehpicx" })
//   .where(eq(user.username, "admin"));

// const admin = await db.query.user.findFirst({
//   where: (user, { eq }) => eq(user.username, "admin"),
// });

// console.log(admin);
//

// getEmailRoutingAddresses().then((res) => {
//   console.log(
//     res.data.result
//       .map((rule) => rule.matchers[0].value)
//       .filter((email) => email?.endsWith("cialabs.tech")),
//   );
// });

// [
//   "varshini@student.cialabs.tech",
//   "ashish@student.cialabs.tech",
//   "likhitadr@student.cialabs.tech",
//   "thejas@student.cialabs.tech",
//   "sadiya@student.cialabs.tech",
//   "raina@student.cialabs.tech",
//   "prithvi@student.cialabs.tech",
//   "siddiq@student.cialabs.tech",
//   "krunal@student.cialabs.tech",
//   "akshith.v.n@student.cialabs.tech",
//   "vamshita@cialabs.tech",
//   "thanmay@cialabs.tech",
//   "john@cialabs.tech",
//   "tejus@cialabs.tech",
//   "ark@cialabs.tech",
//   "surya@cialabs.tech",
//   "raj@cialabs.tech",
//   "vamsi@cialabs.tech",
// ].forEach(async (email) => {
//   const username = email.split("@")[0];
//   console.log(username);
//   const res = await registerUser(username, username, {
//     username,
//     email,
//     role: email.endsWith("@student.cialabs.tech") ? "student" : "core",
//   });
//   console.log(res);
// });
//
getUserByDiscordUsername("xrehpicx").then((res) => {
  console.log(res);
});
