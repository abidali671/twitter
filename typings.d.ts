export interface Tweet extends TweetBody{
    _id: string,
    _createdAt: string,
    _updatedAt: string,
    _rev: string,
    _type: 'tweet',
    blockTweet: boolean
}
export type TweetBody={
    text: string,
    username: string,
    profileImg:string,
    image?: string | null,
}
export type commentBody ={
    comment:string,
    tweetId:string,
    username:string,
    profileImg:string,
}
export interface Comment extends commentBody{
    _id: string,
    _createdAt: string,
    _updatedAt: string,
    _rev: string,
    _type: 'comment',
tweet:{
    _ref:string,
    _type: 'reference',
}
}