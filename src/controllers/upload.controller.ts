import { FastifyReply, FastifyRequest } from 'fastify';
import * as fs from 'node:fs';
import { Types, UpdateQuery } from 'mongoose';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { IsObjectId } from '../utils/schema.util';

import Gig, { IGig, LooseIGig } from '../models/gig.model';

const pump = promisify(pipeline);
const updateProfilePicture = async (
    req: FastifyRequest,
    reply: FastifyReply,
) => {
    try {
        const {
            active,
            description,
            preferredTechnologies,
            title,
            budget,
            type,
        }: IGig = req.body as IGig;

        const newGig: IGig = new Gig({
            type,
            title,
            description,
            active,
            budget,
            user: req.auth,
            preferredTechnologies,
        });

        const result = await newGig.save();
        console.log({
            metadata: {
                accessToken: req.newToken,
            },
        });
        const metadata = req.newToken
            ? {
                  accessToken: req.newToken,
              }
            : undefined;
        return reply.code(201).send({
            data: {
                title: result.title,
                description: result.description,
                _id: result._id,
            },
            metadata,
            message: 'Gig created!',
        });
    } catch (err: any) {
        return reply.code(400).send({
            message: 'Bad Request',
            err: err,
        });
    }
};
/*
async function (req, reply) {
        // process a single file
        // also, consider that if you allow to upload multiple files
        // you must consume all files otherwise the promise will never fulfill
        const data = await req.file();

        data.file; // stream
        data.fields; // other parsed parts
        data.fieldname;
        data.filename;
        data.encoding;
        data.mimetype;

        // to accumulate the file in memory! Be careful!
        //
        // await data.toBuffer() // Buffer
        //
        // or

        await pump(data.file, fs.createWriteStream(data.filename));

        // be careful of permission issues on disk and not overwrite
        // sensitive files that could cause security risks

        // also, consider that if the file stream is not consumed, the promise will never fulfill

        reply.send();
*/

export default { updateProfilePicture };
