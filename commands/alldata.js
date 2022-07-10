const { default: consolaGlobalInstance } = require("consola");

module.exports = {
  name: "alldata",
  description: "Dump all data to console, primarily for debugging.",
  perm: 1,
  async execute(client, message, args, Tickets) {
    let all = await Tickets.findAll({ attributes: ["member"] });

    all.map((t) => consola.log(t));
  },
};
