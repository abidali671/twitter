import React, { useRef, useState, Dispatch, SetStateAction } from "react";
import {
  PhotoIcon,
  MagnifyingGlassCircleIcon,
  FaceSmileIcon,
  CalendarIcon,
  MapIcon,
  MicrophoneIcon
} from "@heroicons/react/24/outline";
import useRecorder from "./Recorder";
import { useSession, signIn, signOut } from "next-auth/react";
import { TweetBody, Tweet } from "../typings";
import { fetchTweets } from "../utils/fetchTweets";
import { toast } from "react-hot-toast";

interface Props {
  setTweets: Dispatch<SetStateAction<Tweet[]>>;
}

const TweetBox = ({ setTweets }: Props) => {
  const [input, setInput] = useState<string>("");
  let [audioURL, isRecording, startRecording, stopRecording] = useRecorder();
  const { data: session } = useSession();
  const [image, setImage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState("");
  const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const dragImageRef = useRef<HTMLInputElement>(null);
  console.log(dragImageRef?.current?.value);

  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [micOn, SetMicOn] = useState<boolean>(false);
  let addImageToTweet = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!imageInputRef.current?.value) return;
    setImage(imageInputRef.current?.value);
    imageInputRef.current.value = "";
    setImageUrlBoxIsOpen(false);
  };

  const postTweet = async () => {
    const tweetInfo: TweetBody = {
      text: input,
      username: session?.user?.name || "Unknown user",
      profileImg:
        session?.user?.image ||
        "https://pbs.twimg.com/profile_images/930696245890502658/sRbuUxtU_400x400.jpg",
      image: selectedImage || image,
    };
    const result = await fetch(`/api/addTweet`, {
      body: JSON.stringify(tweetInfo),
      method: "POST",
    });
    const json = await result.json();
    const newTeets = await fetchTweets();
    setTweets(newTeets);
    toast("Tweet Posted", {
      icon: "🚀",
    });
    console.log(newTeets);

    return json;
  };
  let handleImage = (e: any) => {
    const file = e.target.files[0];
    const fileTypes = ["jpeg", "png", "gif", "jpg"];

    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    } else {
      setSelectedImage("");
    }

    console.log("image===>", file);
  };

  let handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    postTweet();
    setInput("");
    setImage("");
    setImageUrlBoxIsOpen(false);
    setSelectedImage("");
  };

  return (
    <div className="mx-4 my-0 flex ">
      <img
        className="w-14 h-14 mt-4 rounded-full object-cover "
        src={
          session?.user?.image ||
          "https://pbs.twimg.com/profile_images/930696245890502658/sRbuUxtU_400x400.jpg"
        }
        alt=""
      />
      <div className="flex flex-1 pl-2">
        <form className="flex flex-1 flex-col">
          <input
            value={input}
            className="placeholder:text-lg text-lg h-24 w-full outline-none"
            type="text"
            placeholder="What's Happening?"
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex items-center px-2">
            <div className="flex flex-1 space-x-2 text-twitter ">
              {/* icon */}
              <PhotoIcon
                onClick={() => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)}
                className="h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150"
              />
              <MagnifyingGlassCircleIcon className="h-5 w-5" />
              <FaceSmileIcon className="h-5 w-5" />
              
           
              <MicrophoneIcon className="h-5 w-5 cursor-pointer"  onClick={()=>SetMicOn(!micOn)}/>
              {micOn &&(
                 <div className="">
                 <audio src={audioURL} controls className="w-52" />
                 <div className="flex space-x-2 items-center justify-center ">
                 <button className="disabled:text-gray-100" onClick={startRecording} disabled={isRecording}>
                   Start
                 </button>
                 <button  className="disabled:text-gray-100" onClick={stopRecording} disabled={!isRecording}>
                   Stop
                 </button>
                 </div>
               </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!input || !session}
              className="text-white bg-twitter px-5 py-2 font-bold rounded-full disabled:opacity-40"
            >
              Tweet
            </button>

           
          </div>

          {imageUrlBoxIsOpen && (
            <div className="flex space-x-2 mt-2">
              <div className="h-[100px] border-twitter border-dotted border-x border-y">
                <div className="flex justify-center items-center ">
                  <label className="flex flex-col justify-center items-center w-[200px] h-24 bg-gray-50 rounded-lg p-2 cursor-pointer">
                    <div className="flex flex-col justify-center items-center pt-5 pb-6">
                      <svg
                        aria-hidden="true"
                        className="mb-3 w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold px-1">
                          Click to upload
                        </span>
                        Drag or drop
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      onChange={handleImage}
                    />
                  </label>
                </div>
              </div>
              <div className="h-[100px] border-twitter border-dotted border">
                <p
                  className="px-5 py-10  hover:bg-gray-50 cursor-pointer"
                  onClick={() => setFormOpen(!formOpen)}
                >
                  Add Link Image
                </p>
              </div>
            </div>
          )}
          {imageUrlBoxIsOpen && formOpen && (
            <form className="mt-5 flex rounded-lg bg-twitter/80 py-2 px-4">
              <input
                ref={imageInputRef}
                className="flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white "
                type="text"
                placeholder="Enter your Image Url.."
              />
              <button
                type="submit"
                onClick={addImageToTweet}
                className="font-bold text-white"
              >
                Add Image
              </button>
            </form>
          )}
          {image && (
            <img
              src={image}
              alt=""
              className="mt-10 h-40 w-full rounded-lg object-contain shadow-lg"
            />
          )}
          {selectedImage && (
            <div>
              <img alt="not fount" width={"250px"} src={selectedImage} />
              <br />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TweetBox;
