import { Request, Response } from "express";
import booru from "booru";
import ContentType from "./contentType.js";

/**
 * Searches the booru for an image to return.
 * @param _req Express request (not used)
 * @param res Node Response
 */
export default function Search(_req: Request, res: Response) {
  booru
    .search(res.locals.booru, res.locals.tags, { random: true, limit: 1 })
    .then(async (post) => {
      const imageURL = post[0]?.fileUrl as string;

      const type = imageURL.split(".").pop() as string;
      res.setHeader("content-type", ContentType(type));

      const img = await fetch(imageURL)
        // Turn the image into an ArrayBuffer (which is also a Promise)
        .then(async (fetchRes) => {
          return fetchRes?.arrayBuffer();
        })
        .catch((err: Error) => {
          console.error(err);
          res.status(500).json({ msg: "Wife machine broke", error: err });
        });

      // deepcode ignore XSS: nmp
      res.status(200).end(Buffer.from(img as ArrayBuffer), "binary");
    })
    .catch((err: Error) => {
      res.status(400).json({ msg: "WaaS Error", error: err });
      console.error(err);
    });
}
