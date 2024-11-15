import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

export default function RoomPage() {
  const location = useLocation();
  const { chat, chatId, userId, username, voice } = location.state;
  const zpRef = React.useRef(null);

  const roomID = chatId || "12345";
  const userID = userId || "hello";
  const userName = username || "hello";
  const appID = 1733230220;
  const serverSecret = "4183a0b873da38547b5da242b0786dbe";

  let myMeeting = async (element) => {
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      userID,
      userName
    );
    // create instance object from token
    zpRef.current = ZegoUIKitPrebuilt.create(kitToken);
    const zp = zpRef.current;

    // start the call
    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
      turnOnCameraWhenJoining: voice ? false : true,
      showMyCameraToggleButton: voice ? false : true,
      showAudioVideoSettingsButton: voice ? false : true,
      showScreenSharingButton: voice ? false : true,
    });
  };

  React.useEffect(() => {
    return () => {
      console.log(zpRef.current);
      if (!zpRef.current) return;
      zpRef.current.destroy();
    };
  }, []);

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}
