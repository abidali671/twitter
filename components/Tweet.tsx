import React, { useState, useEffect } from "react";
import { Comment, Tweet, commentBody } from "../typings";
import TimeAgo from "react-timeago";
import Record from "../components/Recorder";
import {
  ChatBubbleLeftIcon,
  ArrowsRightLeftIcon,
  ArrowUpTrayIcon,
  HeartIcon,
  XMarkIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import LikeButton from "../components/LikeButton";
import { sanityClient } from "../sanity";
import { fetchComments } from "../utils/fetchComments";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { fetchTweets } from "../utils/fetchTweets";

interface Props {
  tweet: Tweet;
  // timer:boolean;
  postDelete: (id: any) => {};
  undo: [];
  show: boolean;
  setUndoButton: any;
  undoButton: any;
  setUndo: any;
  setShow: any;
}
const TweetComponent = ({
  tweet,
  postDelete,
  undo,
  setUndoButton,
  setUndo,
  undoButton,
  setShow,
}: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const { data: session } = useSession();
  const [updateStatus, setUpdateStatus] = useState<boolean>(false);
  const [inputUpdate, setInputUpdate] = useState(tweet.text);
  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id);
    let loadComment = comments.slice(0, 4);
    setComments(loadComment);
  };
  // console.log("twe=", undo);

  useEffect(() => {
    refreshComments();
  }, [comments, undo, undoButton]);

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const commentToast = toast.loading("Posting Comment...");

    // Comment logic

    const comment: commentBody = {
      comment: input,
      tweetId: tweet._id,
      username: session?.user?.name || "Unknown User",
      profileImg: session?.user?.image || "https://links.papareact.com/gll",
    };

    const result = await fetch(`/api/addComment`, {
      body: JSON.stringify(comment),
      method: "POST",
    });

    console.log("WOOHOO we made it", result);
    toast.success("Comment Posted!", {
      id: commentToast,
    });

    setInput("");
    setCommentBoxVisible(false);
    refreshComments();
  };

  // likeButton
  const handleLike = async (like: boolean) => {
    // if (userProfile) {
    //   const res = await axios.put(`${BASE_URL}/api/like`, {
    //     userId: userProfile._id,
    //     postId: post._id,
    //     like
    //   });
    //   setPost({ ...post, likes: res.data.likes });
    // }
  };

  // deleteComment
  let deleteComment = async (Id: string) => {
    const commentToast = toast.loading("Deleting Comment...");

    const post = {
      _id: Id,
    };
    const result = await fetch(`/api/deleteComment`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post._id),
    });
    if (result.status === 200) {
      toast.success("Comment Deleted!", {
        id: commentToast,
      });
      refreshComments();
    }

    console.log(result);
  };

  let updateTweet = async (id: any, text: string) => {
    setUpdateStatus(false);
    const result = await fetch(`/api/updateStatus`, {
      method: "PATCH",
      body: JSON.stringify({
        _id: id,
        text: text,
        profileImg: session?.user?.image,
        username: session?.user?.name || "Unknown User",
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((json) => console.log("wor", json));
    console.log("work==", result);
  };
  let backUndo = (Id: any) => {
    if (undoButton == true) {
      setUndoButton(false);
      undo.push(Id);
      setShow(false);
    } else {
      setUndoButton(true);
      setShow(false);
    }
    
  };
  return (
    <div className="hover:bg-gray-50 flex flex-col space-x-1 border-y mt-2 p-5 border-gray-300">
      {undo.find((val) => val == tweet._id) && undoButton ? (
        <button onClick={() => backUndo(tweet._id)}>Undo</button>
      ) : (
        <div className="flex space-x-3">
          <img
            className="h-10 w-10 rounded-full object-cover cursor-pointer"
            src={tweet.profileImg}
            alt=""
          />
          <div>
            <div className="flex items-center space-x-1">
              <p className="mr-1 font-bold cursor-pointer">{tweet.username}</p>
              <p className="hidden text-sm text-gray-500 sm:inline-block">
                @{tweet.username.replace(/\s+/g, "").toLowerCase()}
              </p>
              <TimeAgo
                className="text-sm text-gray-500 "
                date={tweet._createdAt}
              />
            </div>
            {updateStatus ? (
              <>
                <input
                  type="text"
                  value={inputUpdate}
                  onChange={(e) => setInputUpdate(e.target.value)}
                  className="focus:outline-none px-2 py-2 mr-3 bg-twitter/5"
                />
                <button
                  className="text-twitter"
                  onClick={() => updateTweet(tweet._id, inputUpdate)}
                >
                  Update
                </button>
              </>
            ) : (
              <p className="pt-1">{inputUpdate}</p>
            )}
            {/* {undo == tweet._id && undoButton ? "Undo" : ""} */}
            {tweet.image && (
              <img
                className="cursor-pointer m-5 ml-0 mb-1 rounded-lg object-cover shadow-xl"
                src={tweet.image}
              />
            )}
          </div>
          <div>
            <XMarkIcon
              className="h-5 w-5 mx-8 cursor-pointer"
              onClick={() => postDelete(tweet._id)}
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex justify-between ">
        <div
          onClick={() => session && setCommentBoxVisible(!commentBoxVisible)}
          className="flex items-center cursor-pointer space-x-1 text-gray-400"
        >
          <ChatBubbleLeftIcon className="h-5 w-5 " />
          <p>{comments.length}</p>
        </div>
        <div className="flex items-center cursor-pointer space-x-1 text-gray-400">
          <ArrowsRightLeftIcon className="h-5 w-5 " />
        </div>
        <div className="flex items-center cursor-pointer space-x-1 text-gray-400  rounded-lg">
          <HeartIcon className="h-5 w-5" />
        </div>
        <div className="flex items-center cursor-pointer space-x-1 text-gray-400">
          <PencilSquareIcon
            onClick={() => setUpdateStatus(!updateStatus)}
            className="h-5 w-5 "
          />
        </div>
      </div>

      {/* comment box */}
      {commentBoxVisible && (
        <div className="mt-3 flex space-x-3">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            className="flex-1 rounded-lg bg-gray-100 outline-none p-2"
            placeholder="Write a comment.."
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!input || !session}
            className="disabled:text-gray-200 text-twitter"
          >
            Post
          </button>
        </div>
      )}

      {comments.length > 0 && (
        <div className="space-y-5 max-h-56 my-2 mt-5 overflow-y-scroll border-t border-gray-100 p-5 ">
          {comments.map((comment: Comment) => (
            <div key={comment._id} className="relative flex space-x-2">
              <hr className="absolute left-5 h-8 top-10 border-x border-twitter/30" />
              <img
                src={comment.profileImg}
                className="mt-2 h-7 w-7 object-cover rounded-full"
                alt=""
              />
              <div>
                <div className="flex items-center space-x-1">
                  <p className="mr-1 font-bold ">{comment.username}</p>
                  <p className="hidden text-sm text-gray-500 lg:inline">
                    @{comment.username.replace(/\s+/g, "").toLowerCase()}
                  </p>
                  <TimeAgo
                    className="text-sm text-gray-500"
                    date={comment._createdAt}
                  />
                </div>

                <>
                  <p>{comment.comment}</p>
                </>
              </div>
              <div className="h-5 w-5 cursor-pointer">
                {session?.user?.image !== comment.profileImg ? (
                  ""
                ) : (
                  <TrashIcon onClick={() => deleteComment(comment._id)} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TweetComponent;
