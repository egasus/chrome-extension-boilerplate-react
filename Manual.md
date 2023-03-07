# Chrome Extension
This project was forked from https://github.com/lxieyang/chrome-extension-boilerplate-react. 

## How to get your User Token

### 1. [Create/Select a Select a Slack App ](https://api.slack.com/apps)

### 2. Click `OAuth & Permissions` in the left panel, Go to `Scopes`
You can add the following permissions according to your requirements. Bot tokens are often used for creating a chat bot. If you just want to manipulate your private channels, you need to add some permissions in `User Token Scopes`

#### [`chat.delete`](https://api.slack.com/methods/chat.delete)
| type | scope |
| ---- | ----- |
| Bot tokens | `chat:write` `channels:history`, `channels:read`

#### [`conversations.history`](https://api.slack.com/methods/conversations.history)
| type | scope |
| ---- | ----- |
| Bot tokens | `channels:history ``groups:history` `im:history` `mpim:history`

#### [`conversations.list`](https://api.slack.com/methods/conversations.list)
| type | scope |
| ---- | ----- |
| Bot tokens | `channels:read ``groups:read` `im:read` `mpim:read`
| User Tokens | `identify`,`channels:history`,`groups:history`,`im:history`,`mpim:history`,
`channels:read`,`mpim:read`,`users:read`,`channels:write`,`chat:write`

### 3. `Install/Reinstall to Workspace`

Gotcha! You can copy your token from `OAuth & Permissions/OAuth Tokens for Your Workspace/User OAuth Token`. You can test apis in this online API tester - [https://api.slack.com/methods/${method}/test](https://api.slack.com/methods/conversations.list/test)

## Limitation

- User tokens are required to delete messages in private channels(person to person).
- You can only remove your own messages.