# ZynBot.JS

Framework for creating **self-bots** for [Zyntra](https://zyntra.xyz) using JavaScript.  
🚨 **WARNING:** This framework is designed for **self-bots**, which operate using regular user accounts instead of official bot accounts.

## ⚠ Important Notice  
- **Using self-bots may violate Zyntra's Terms of Service in the future.**  
  Be aware that rules can change, and using this framework might become **against the platform’s policies**.  
- **Strict API rate limits apply** to non-bot accounts.  
  - Self-bots have significantly **lower request limits** than official bots.  
  - The current limit is **12 messages per 10 seconds**.  
  - Exceeding this limit may result in **temporary restrictions** on your account.

## Features
- Simple API for automating a Zyntra user account
- Custom command handling
- Event-driven system to react to messages and actions
- Lightweight and easy to extend

## Example
```js
import { Client } from "zynbot.js";

const client = new Client("session_secret", id);

client.on("ready", async (user) => {
  console.log("Working");
});

client.on("messageSent", async (message) => {
  if(message.content.toLowerCase() == "!ping")
    await client.reply(
        message.channel.id,
        "Pong!",
        message.id
      );
});

client.login();
```

## Installation
```sh
npm install zynbot.js
```