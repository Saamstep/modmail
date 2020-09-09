let init = 0;
exports.run = async (client) => {
  if (client.config.status.length === 1) {
    client.user.setActivity(client.config.status[0].msg, { type: client.config.status[0].type });
    return client.cn.error("Status", "Please add at least 2 status'!");
  }
  let status = client.config.status;
  await client.user.setActivity(client.config.status[init].msg, { type: client.config.status[init].type });

  init++;
  if (init >= status.length) init = 0;
};

exports.time = 60000;
