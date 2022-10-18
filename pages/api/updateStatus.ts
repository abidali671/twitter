// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { sanityClient } from '../../sanity'

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'PATCH') {
        const { _id, text, profileImg, username } = req.body


        const doc = {
            _id: _id,
            _type: 'tweet',
            text: text,
            profileImg: profileImg,
            username: username,
        }



        sanityClient
            .patch(_id) // Document ID to patch
            .set(doc) // Shallow merge

            .commit() // Perform the patch and return a promise
            .then((updatedBike) => {
                console.log('Hurray, the bike is updated! New document:')
                console.log(updatedBike)
            })
            .catch((err) => {
                console.error('Oh no, the update failed: ', err.message)
            })












    }
}