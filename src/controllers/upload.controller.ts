import { FastifyReply, FastifyRequest } from 'fastify';
import * as fs from 'node:fs';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { IsObjectId } from '../utils/schema.util';

import Gig, { IGig, LooseIGig } from '../models/gig.model';

import User, { IUser, LooseIUser } from '../models/user.model';
import Image, { IImage, LooseIImage } from '../models/image.model';

import path from 'node:path';
import { uniqueFileName } from '../utils/upload.util';

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

        console.log({
            metadata: {
                accessToken: req.newToken,
            },
        });
        const ext = dataFile ? dataFile.filename.split('.')[1] : null;
        const image = dataFile
            ? await Image.create({
                  ext,
                  size: dataFile.file.bytesRead,
              })
            : null;

        if (image && dataFile) {
            filePath = image
                ? path.join(
                      __dirname,
                      '..',
                      '..',
                      '/public/',
                      image.id + '.' + ext,
                  )
                : '';
            await pump(dataFile.file, fs.createWriteStream(filePath));
        }

        const result = await User.findOneAndUpdate(
            { _id: auth },
            {
                picture: image,
            },
            {},
        );
        console.log(result);
        console.log(result?.picture);
        if (!result) throw new Error('User not found');
        if (result.picture) {
            await Image.deleteOne({ _id: result.picture });
            const dirPath = path.join(__dirname, '..', '..', '/public/');
            const files = fs.readdirSync(dirPath);
            const fileToDelete = files.find(file =>
                file.startsWith(result.picture as any as string),
            );

            if (fileToDelete) {
                fs.unlinkSync(path.join(dirPath, fileToDelete));
            }
        }

        return reply.code(200).send({
            data: image,
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

export default { updateProfilePicture };
