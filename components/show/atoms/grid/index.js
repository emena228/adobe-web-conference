import React from "react";
import Audience from "./../audience";
import Presenters from "./../presenters";

const Grid = ({
  mainPresenterVideoTrack,
  presentersVideoTrack,
  stageVideoTrack,
  myPresenterVideoTrack,
  myStageVideoTrack,
  localVideoTrackShow,
  localMainVideoTrackShow 
}) => {
  return (
    <div>
      <Presenters
        mainPresenterVideoTrack={mainPresenterVideoTrack}
        presentersVideoTrack={presentersVideoTrack}
        stageVideoTrack={stageVideoTrack}
        myPresenterVideoTrack={myPresenterVideoTrack}
        myStageVideoTrack={myStageVideoTrack}
        localVideoTrackShow={localVideoTrackShow}
        localMainVideoTrackShow={localMainVideoTrackShow}
      />
      <Audience />
    </div>
  );
};

export default Grid;
