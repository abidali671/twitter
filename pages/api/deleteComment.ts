// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { commentBody } from '../../typings'
import { sanityClient } from '../../sanity'
import { log } from 'console'

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'DELETE') {
        const id = req.body;
        // const { id } = req.query

        console.log('dlt', id)

        sanityClient.delete(id).then((res) =>console.log(res))
      

        res.status(200).json({ name: 'Delete' })
    }
}
