import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';
import { Tooltip } from '../components/ui/tooltip';
import { Avatar } from '../components/ui/avatar';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  // Ensure messages is a valid array
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    console.warn("No valid messages to render.");
    return null;
  }

  return (
    <ScrollableFeed>
      {messages.map((m, i) => {
        // Safety check for current message and sender
        if (!m || !m.sender) return null;

        return (
          <div style={{ display: 'flex' }} key={m._id || i}>
            {(isSameSender(messages, m, i, user?._id) || isLastMessage(messages, i, user?._id)) && (
              <Tooltip content={m.sender.name}
                positioning={{ placement: "right-end" }}
                showArrow>
                <Avatar
                  marginTop="7px"
                  marginRight="1px"
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                  fallback={<div>{m.sender.name?.[0]}</div>}
                />
              </Tooltip>
                )}
                <span
                    style={{
                        backgroundColor: `${m.sender._id === user?._id ? '#BEE3F8' : "#B9F5D0"}`,
                        borderRadius: "20px",
                        padding: "5px 15px",
                        maxWidth: "75%",
                        marginLeft: isSameSenderMargin(messages, m, i, user._id),
                        marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                    }}
                >
                     {m.content}
                </span>
          </div>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
