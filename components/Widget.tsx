import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  TwitterTimelineEmbed,
  TwitterShareButton,
  TwitterFollowButton,
  TwitterHashtagButton,
  TwitterMentionButton,
  TwitterTweetEmbed,
  TwitterMomentShare,
  TwitterDMButton,
  TwitterVideoEmbed,
  TwitterOnAirButton,
} from "react-twitter-embed";
const Widget = () => {
  return (
    <div className="mt-2 px-2 w-[30%] hidden lg:inline-block flex-auto flex-col">
      <div className="flex items-center space-x-2 bg-gray-100 p-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          className="flex-1  outline-none bg-transparent"
          placeholder="Search Twitter"
        />
      </div>
      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="AbdulWahabSid18"
        options={{ height: 1000 }}
      />
    </div>
  );
};

export default Widget;
