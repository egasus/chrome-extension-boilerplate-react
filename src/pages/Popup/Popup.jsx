import React, { useState, useEffect } from 'react';
import { getUserId, removeMessages } from '../../api/slack';
import BeatLoader from "react-spinners/BeatLoader";
import './custom.css';

const override = {
  display: "block",
  // margin: "0 auto",
  // borderColor: "#007bff",
};

const Popup = () => {
  const [ data, setData] = useState({
    uToken: "",
    channelId: "",
    userId: "",
    limit:10,
  });

  const [isFetching,setIsFetching] = useState(false);

  const handleDeleteClick = () => {
    // code to delete messages using userToken and channelId
    const {uToken,channelId,userId,limit} = data;
    console.log(`removing slack messages... ${uToken},${channelId},${userId}`)
    removeMessages(uToken,channelId,userId,limit);
  };

  const  fetchUserId = async (token) => {
    const uid = await getUserId(token);
    console.log("fetched uid:",uid);
    setData((prev)=>({...prev,userId:uid}));
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Enforce that first character is non-zero when pasting text
    if (name === "limit" && !/^[1-9][0-9]*$/.test(value)) {
      return;
    }
    setData((prev)=>({...prev,[name]:value}));
    
    // if (name !== "uToken") return;
    // setIsFetching(true);
    // fetchUserId(value);
    // setTimeout(() => {
    //   // code to be executed after 3 seconds
    //   setIsFetching(false);
    // }, 1500);
    // setIsFetching(false);
  }

  const handleLinkClick = () => {
    chrome.tabs.create({ url: 'https://github.com/egasus/chrome-extension-boilerplate-react/blob/slackbot/draft/Manual.md' });
  };

  function handlePaste(event) {
    
    const clipboardData = event.clipboardData || window.clipboardData;
    const value = clipboardData.getData('text');
    const { name } = event.target;
    setData((prev)=>({...prev,[name]:value}));
    
    console.log(value);
    if (name !== "uToken") return;
    setIsFetching(true);
    fetchUserId(value);
    setTimeout(() => {
      // code to be executed after 1.5 seconds
      setIsFetching(false);
    }, 1500);

    event.preventDefault();
  }

  function handleKeyDown(event) {
    switch(event.key) {
      case 'Backspace':
      case 'Delete':
        const { name } = event.target;
        setData((prev)=>({...prev,[name]:''}));
        if (name !== "uToken") return;
        setData((prev)=>({...prev,userId:''}));
        break;
      case 'v':
      case 'V':
        if (event.ctrlKey || event.metaKey) return;
        break;
      default:
        break;
    }
    event.preventDefault();
  }

  const handleNumberInput = (event) => {
    switch(event.key) {
      case 'Backspace':
      case 'Delete':
        const { name } = event.target;
        setData((prev)=>({...prev,[name]:''}));
        break;
      default:
        break;
    }

    // Allow only numeric input
    if (!/^\d*$/.test(event.key)) {
      event.preventDefault();
      return;
    }

    // Enforce that first character is non-zero
    if (event.target.value.length === 0 && event.key === '0') {
      event.preventDefault();
      return;
    }
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const url = tabs[0].url;
      if (url.includes("https://app.slack.com/client/")) {
        const path = new URL(url).pathname;
        const parts = path.split('/');
        setData(prev=>({...prev,channelId:parts[3]}));
      }

    });
  }, []);

  return (
    <div className="popup">
      <div className="container">
        <h2>Delete Slack Messages</h2>
        <div className="form-group">
          <label>User Token:</label>
          <input
            tabindex="1"
            type="text"
            className="form-control"
            name="uToken"
            value={data.uToken}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="form-group">
          <label>Channel ID:</label>
          <input
            tabindex="2"
            type="text"
            className="form-control"
            name="channelId"
            value={data.channelId}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="form-group">
          <label>{`Number of Messages(Being Deleted):`}</label>
          <input
            tabindex="3"
            type="text"
            className="form-control"
            name="limit"
            value={data.limit}
            onKeyDown={handleNumberInput}
            onChange={handleChange}
          />
        </div>
        <div className="form-info">
          <label>{`User ID: `}</label>
          {
            isFetching?
              <BeatLoader cssOverride={override} size={3} color={"#4CAF50"} loading={isFetching} />:
              <label>{data.userId?data.userId:data.uToken?"Invalid Token":"No Token"}</label>
          }
        </div>
        <button disabled={data.userId && data.channelId?false:true} onClick={handleDeleteClick}>Delete Messages</button>
      </div>
      <a href="#" onClick={handleLinkClick}>Need Guide? Click Me!</a>
    </div>
  );
};

export default Popup;
