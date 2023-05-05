const DiscordRPC = require('discord-rpc');
const ffi = require('ffi-napi');
const ref = require('ref-napi');
const sleep = require('util').promisify(setTimeout);
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const schedule = require('node-schedule');

const discordWebhook = 'https://discord.com/api/webhooks/1104096514327990373/XGMALG3b_t9yHkJUYhjec2OsM1ikhifPvLBRwLiOj4siD_s5jM_f9sIEaehTAnPUudZD';

require('dotenv').config();

const details = process.env.DETAILS;
const state = process.env.STATE;
const token = process.env.TOKEN;
const discordId = process.env.DISCORD_ID;
const discordNotify = process.env.DISCORD_NOTIFY === 'true';
const discordStarRail = process.env.DISCORD_STAR_RAIL === 'true';
const discordName = process.env.DISCORD_NAME;


// Discord RPC
const clientId = '1101519652825350184';
DiscordRPC.register(clientId);
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

const user32 = new ffi.Library('user32', {
  FindWindowA: ['long', ['string', 'string']],
});

function isStarRail() {
  const hWnd = user32.FindWindowA('Qt5QWindowIcon', 'Star Rail');
  return hWnd !== 0;
}

async function autoSignFunction() {
  const signurl_hsr = 'https://sg-public-api.hoyolab.com/event/luna/os/sign?lang=en-us&act_id=e202303301540311';
  const options = {
    method: 'POST',
    headers: { Cookie: token },
  };

  try {
    const response = await fetch(signurl_hsr, options);
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function postWebhook(data) {
  const payload = {
    username: 'auto-sign',
    avatar_url: 'https://i.pinimg.com/originals/eb/b5/81/ebb5817b23e21f5b4098dd71c10d049f.jpg',
    content: `${discordId ? `<@${discordId}>` : discordName}, tes récompenses HoYoLab quotidiennes ont été récupérées ! <:flowerr:1104105281153155122>`,
  };

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };

  try {
    await fetch(discordWebhook, options);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function scheduleAutoSign() {
  const rule = new schedule.RecurrenceRule();
  rule.hour = 16; // 00 h 00 UTC+8 est équivalent à 16 h 00 UTC
  rule.minute = 0;
  rule.second = 0;
  rule.tz = 'Etc/GMT-8';

  schedule.scheduleJob(rule, async () => {
    if (discordStarRail && discordNotify) {
      const signResponse = await autoSignFunction();
      if (signResponse) {
        console.log('Sign response:', signResponse);
        await postWebhook(signResponse);
        console.log('Webhook sent.');
      }
    }
  });

  console.log('Scheduled auto sign job.');
}

async function main() {
  let rpcConnected = false;

  // Schedule the auto sign job
  await scheduleAutoSign();

  while (true) {
    try {
      const starRailRunning = isStarRail();
      console.log('Star Rail running:', starRailRunning);

      if (starRailRunning && !rpcConnected) {
        await rpc.login({ clientId });
        rpcConnected = true;
        await rpc.setActivity({
          details: details,
          state: state,
          largeImageKey: 'hsr_icon',
          startTimestamp: new Date(),
        });        

        console.log('Discord RPC connected.');
      } else if (!starRailRunning && rpcConnected) {
        await rpc.destroy();
        rpcConnected = false;
        console.log('Discord RPC disconnected.');
      }

      if (!starRailRunning && discordStarRail && discordNotify) {
        const signResponse = await autoSignFunction();
        if (signResponse) {
          console.log('Sign response:', signResponse);
          await postWebhook(signResponse);
          console.log('Webhook sent.');
        }
      }

      await sleep(15 * 1000);
    } catch (error) {
      console.error('Error:', error);
      if (rpcConnected) {
        await rpc.destroy();
        rpcConnected = false;
        console.log('Discord RPC disconnected due to error.');
      }
      await sleep(15 * 1000);
    }
  }
}

main();