import React, { useState, useEffect } from "react";
import TweetBox from "./TweetBox";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Tweet } from "../typings";
import TweetComponent from "../components/Tweet";
import { fetchTweets } from "../utils/fetchTweets";
import { fetchComments } from "../utils/fetchComments";
import toast from "react-hot-toast";
import { log } from "console";
import { isAsyncFunction } from "util/types";
interface Props {
  tweets: Tweet[];
}
const Feed = ({ tweets: tweetsProp }: Props) => {
  const [tweets, setTweets] = useState<Tweet[]>(tweetsProp);
  const [timer, setTimer] = useState({});
  const [undo, setUndo] = useState<any>([]);
  const [undoButton, setUndoButton] = useState(false);
  const [show, setShow] = useState(true);
  const [Id, setId] = useState("");

  console.log("tw", tweets);
  const handleRefresh = async () => {
    const refreshToast = toast.loading("Refreshing...");
    const tweets = await fetchTweets();

    setTweets(tweets);
    console.log("tweet", tweets);

    toast.success("Feed updated", {
      id: refreshToast,
    });
  };

  const postDelete = async (id: any) => {
    setTweets((tweet) =>
      tweet.filter((val, ind) => {
        if (val._id !== id) {
          setUndoButton(true);
          undo.push(id);
        }
        return val;
      })
    );
    setShow(true);
    setId(id);
    console.log(id);
  };

  const undoData = async () => {
    if (show) {
      const result = await fetch(`/api/deletePost`, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Id),
        method: "DELETE",
      });
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setTweets((tweet) => tweet.filter((val) => val._id !== Id));
      setShow(false);
    }, 3000);
    undoData();
  }, [undo, show]);

  return (
    <div className="w-[55%] flex-auto   max-h-screen flex-col border-x">
      <div className="flex items-center justify-between">
        <h1 className="p-5 pb-0 text-lg font-bold">Home</h1>
        <ArrowPathIcon
          onClick={handleRefresh}
          className="mr-5 mt-5 h-8 w-8 cursor-pointer text-twitter transition-all duration-500 ease-out hover:rotate-180 active:scale-125"
        />
      </div>
      <div>
        <TweetBox setTweets={setTweets} />
      </div>
      {/* feed */}
      {tweets.length > 0 ? (
        <div>
          {tweets.map((tweet) => (
            <TweetComponent
              key={tweet._id}
              tweet={tweet}
              postDelete={postDelete}
              undo={undo}
              show={show}
              setUndo={setUndo}
              setUndoButton={setUndoButton}
              undoButton={undoButton}
              setShow={setShow}
            />
          ))}
        </div>
      ) : (
        <div className="text-center m-3 flex justify-center items-center flex-col">
          <p className="text-lg font-thin">Create a post for freinds</p>
          <img
            className="object-cover w-screen  h-52"
            src="https://media.istockphoto.com/vectors/friends-vector-id1173780314?k=20&m=1173780314&s=612x612&w=0&h=m2ShqqBZkuQXSFDnHJA0gciFO8fWqG3Q9PqfphFQ0wI="
            alt=""
          />
        </div>
      )}
    </div>
  );
};

export default Feed;
