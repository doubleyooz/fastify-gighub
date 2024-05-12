import { FastifyReply, FastifyRequest } from 'fastify';
import * as fs from 'node:fs';
import { Types, UpdateQuery } from 'mongoose';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { IsObjectId } from '../utils/schema.util';

import Gig, { IGig, LooseIGig } from '../models/gig.model';

import User, { IUser, LooseIUser } from '../models/user.model';
import Image, { IImage, LooseIImage } from '../models/image.model';

import path from 'node:path';

const pump = promisify(pipeline);

const updateProfilePicture = async (
    req: FastifyRequest,
    reply: FastifyReply,
) => {
    const { newToken, auth } = req;
    const metadata = newToken ? { accessToken: newToken } : {};
    let filePath = '';
    try {
        const dataFile = await req.file();
        filePath = dataFile
            ? path.join(__dirname, '..', '..', '/uploads/', dataFile?.filename)
            : '';
        if (dataFile) await pump(dataFile.file, fs.createWriteStream(filePath));

        console.log(dataFile);
        console.log({
            metadata: {
                accessToken: req.newToken,
            },
        });

        const image = dataFile
            ? await Image.create({
                  mimetype: dataFile.mimetype,
                  filename: dataFile.filename,
                  size: dataFile.file.bytesRead,
              })
            : null;

        console.log(image);

        const result = await User.updateOne(
            { _id: auth },
            {
                picture: image,
            },
        );
        console.log(result);
        if (result.matchedCount === 0) throw new Error('User not found');

        return reply.code(200).send({
            data: { ...result },
            metadata,
            message: 'You can see me',
        });
    } catch (err: any) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
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
