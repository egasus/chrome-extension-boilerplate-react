import React from 'react';
import { useState } from 'react';
import { getUserId, removeMessages } from '../../api/slack';
import './custom.css';

const Popup = () => {
  const [ data, setData] = useState({
    uToken: "",
    channelId: "",
    userId: "",
    limit:10,
  });

  const handleDeleteClick = () => {
    // code to delete messages using userToken and channelId
    const {uToken,channelId,userId,limit} = data;
    console.log(`removing slack messages... ${uToken},${channelId},${userId}`)
    removeMessages(uToken,channelId,userId,limit);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev)=>({...prev,[name]:value}));
    const  fetchUserId = async () => {
      const uid = await getUserId(data.uToken);
      if (uid) {
        setData((prev)=>({...prev,userId:uid}));
      }
    }
    if (data.uToken) {
      fetchUserId();
    }
  }

  return (
    <div className="container">
      <h2>Delete Slack Messages</h2>
      <div className="form-group">
        <label>User Token:</label>
        <input
          type="text"
          className="form-control"
          name="uToken"
          value={setData.uToken}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Channel ID:</label>
        <input
          type="text"
          className="form-control"
          name="channelId"
          value={data.channelId}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>{`Number of Messages(Being Deleted):`}</label>
        <input
          type="text"
          className="form-control"
          name="limit"
          value={data.limit}
          onChange={handleChange}
        />
      </div>
      <button disabled={data.userId && data.channelId?false:true} onClick={handleDeleteClick}>Delete Messages</button>
    </div>
  );
};

export default Popup;
