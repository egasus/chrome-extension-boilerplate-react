export async function getUserId(token) {
  const response = await fetch(`https://slack.com/api/auth.test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
  })
  const data = await response.json();
  return data?.user_id;
}

// Retrieve a list of channels and their IDs
async function getChannelIDs(token) {
  fetch(`https://slack.com/api/conversations.list?pretty=1`, {
    method: 'GET',
    headers: {
    Authorization: `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    // Print the name and ID of each channel
    data?.channels?.forEach(channel => {
    console.log(`Channel Name: ${channel.name}, Channel ID: ${channel.id}`);
    });
  });
}

// Retrieve a list of channels and their IDs
async function fetchDirectChannelIDs(token) {
  const response = await fetch(`https://slack.com/api/conversations.list?&types=im`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
  // Return an array of channel IDs
  return data?.channels?.map(channel => {
    console.log(`Channel Name: ${channel.name}, Channel ID: ${channel.id}`);
    return channel.id;
  }) || [];
}

async function getPrivateChannelMessages(uToken,channel_id, limit = 100) {
  try {
    const response = await fetch(`https://slack.com/api/conversations.history?channel=${channel_id}&limit=${limit}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${uToken}`
      }
    });
    const data = await response.json();
    console.log(data);
    if (!data.messages) {
      return [];
    }

    return data.messages;
  } catch (error) {
    console.error(error);
    return [];
  }
};

async function removePrivateChannelMessages(token,channelId,userID,messages) {
  messages && messages.forEach(async message => {
    if (message.user === userID) {
      console.log("deleting");
      await fetch(`https://slack.com/api/chat.delete?channel=${channelId}&ts=${message.ts}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(e=>console.log(e));
    }
  });
}

export async function removeMessages(uToken,cid,uid,limit=10) {
  const _uid = uid??await getUserId(uToken);
  const messages = await getPrivateChannelMessages(uToken,cid,limit);
  await removePrivateChannelMessages(uToken,cid,_uid,messages);
}

// async function test() {
//   // const directChannelIDs = await fetchDirectChannelIDs(token);
//   // console.log(directChannelIDs);
//   // directChannelIDs.forEach(id => getChannelMessages(id));
//   // const messages = await getPrivateChannelMessages(token,CHANNEL_ID);
//   // const USER_ID = await getUserId();
//   // await removePrivateChannelMessages(CHANNEL_ID,USER_ID,messages);
// }
