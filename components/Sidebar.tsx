import React from "react";

import {
  BellIcon,
  HashtagIcon,
  BookmarkIcon,
  UserIcon,
  HomeIcon,
  EnvelopeIcon,
  ListBulletIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import { useSession, signIn, signOut } from "next-auth/react";

import SidebarRow from "./SidebarRow";
const Sidebar = () => {
  const { data: session } = useSession();
  console.log(session?.timestamp);
  
  console.log(session?.user?.image);
  const sideBarOptions = [
    {
      title: "Home",
      Icon: HomeIcon,
      link: "/",
    },
    {
      title: "Explore",
      Icon: HashtagIcon,
      link: "/explore",
    },
    {
      title: "Notifications",
      Icon: BellIcon,
      link: "/notifications",
    },
    {
      title: "Messages",
      Icon: EnvelopeIcon,
    },
    {
      title: "Bookmarks",
      Icon: BookmarkIcon,
    },
    {
      title: "Lists",
      Icon: ListBulletIcon,
    },

    {
      title: "More",
      Icon: CircleStackIcon,
    },
  ];

  return (
    <div className="flex lg:w-64 md:w-60 sm:w-10 flex-col">
      <img
        className="mt-3 h-10 w-10"
        src="https://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c53e.png"
      />
      {sideBarOptions.map((val, ind) => (
        <SidebarRow Icon={val.Icon} title={val.title} />
      ))}
      <SidebarRow
        onClick={session ? signOut : signIn}
        Icon={UserIcon}
        
        title={session ? "Sign out" : "Sign in"}
      />
    </div>
  );
};

export default Sidebar;
