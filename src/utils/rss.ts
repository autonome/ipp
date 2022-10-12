import xml from "xml";
import { Service, Web3Storage } from "web3.storage";
import * as Name from "w3name";
import config from "utils/config";
import { getW3link, removeHtmlTags } from "./helper";
import MarkdownIt from "markdown-it";
import api from "./api";

const md = new MarkdownIt();
const client = new Web3Storage({
  token: config.REACT_APP_WEB3_STORAGE_API_TOKEN,
} as Service);

export function generateXmlString(posts: IBlog[]) {
  const SITE_BASE_URL = "https://ipp-blog.netlify.app/";
  const xmlObject = {
    rss: [
      {
        _attr: {
          "xmlns:dc": "http://purl.org/dc/elements/1.1/",
          "xmlns:content": "http://purl.org/rss/1.0/modules/content/",
          "xmlns:atom": "http://www.w3.org/2005/Atom",
          "xmlns:media": "http://search.yahoo.com/mrss/",
          version: "2.0",
        },
      },
      {
        channel: [
          {
            "atom:link": {
              _attr: {
                href: "https://k51qzi5uqu5dg77idvtml88k2bc6scmi9aftri6nub8f7k73fjbiw8xau3xe46.ipns.w3s.link",
                rel: "self",
                type: "application/rss+xml",
              },
            },
          },
          { title: "IPP Feed" },
          { link: SITE_BASE_URL },
          { description: "Distributed Blog System" },
          { language: "en-us" },
          { lastBuildDate: new Date().toString() },
          { generator: "IPP App" },
          ...posts.map((post) => {
            const absoluteHREF = `${SITE_BASE_URL}main/blogs/${post.UUID}`;
            return {
              item: [
                { title: post.Title },
                { pubDate: post.Date?.toString() },
                { link: absoluteHREF },
                { guid: absoluteHREF },
                {
                  description: {
                    _cdata: removeHtmlTags(md.render(post.Body || "")),
                  },
                },
                /*
                <media:content medium="image" url="https://www.autocar.co.uk/sites/autocar.co.uk/files/styles/car_review_image_190/public/images/car-reviews/first-drives/legacy/ora_funky_cat_front_ncap_test_2.jpg?itok=y0A7dUaC"/>
                */
              ],
            };
          }),
        ],
      },
    ],
  };

  const xmlString = '<?xml version="1.0" encoding="UTF-8"?>' + xml(xmlObject);
  return xmlString;
}

export async function getRecentEvents() {
  const client = new Web3Storage({
    token: config.REACT_APP_WEB3_STORAGE_API_TOKEN,
  } as Service);

  const blogObjects: IBlog[] = [];
  for await (const upload of client.list()) {
    const contentRes = await api.get(getW3link(upload.cid));
    const { data } = contentRes;
    if (data.Type === "ADD_BLOG" || data.Type === "UPDATE_BLOG") {
      blogObjects.push(data);
    }
  }

  if (blogObjects.length > config.RSS_COUNT) {
    blogObjects.splice(0, blogObjects.length - config.RSS_COUNT);
  }

  blogObjects.reverse();
  for (let i = 0; i < blogObjects.length; i++) {
    const contentRes1 = await api.get(getW3link(blogObjects[i].BodyCID));
    blogObjects[i].Body = contentRes1.data;
  }
  return blogObjects;
}

export async function updateRss() {
  const posts = await getRecentEvents();

  const xmlString = generateXmlString(posts);
  const title = "rss";
  let blob = new File([xmlString], title, { type: "text/xml" });
  const rootCid = await client.put([blob], {
    name: title,
    maxRetries: 3,
    wrapWithDirectory: false,
  });

  // name: k51qzi5uqu5dg77idvtml88k2bc6scmi9aftri6nub8f7k73fjbiw8xau3xe46
  // path: https://k51qzi5uqu5dg77idvtml88k2bc6scmi9aftri6nub8f7k73fjbiw8xau3xe46.ipns.dweb.link/
  //       https://k51qzi5uqu5dg77idvtml88k2bc6scmi9aftri6nub8f7k73fjbiw8xau3xe46.ipns.w3s.link/
  //       https://k51qzi5uqu5div70qnyjfu5y0mwzcqs2fegxnq2fafo5oy145lwsb369mqyjir.ipns.w3s.link/
  const bytes = [
    8, 1, 18, 64, 156, 104, 197, 108, 98, 238, 128, 116, 13, 126, 208, 222, 80,
    194, 183, 170, 167, 73, 250, 124, 95, 102, 184, 215, 105, 153, 34, 130, 205,
    105, 151, 223, 0, 176, 176, 185, 153, 101, 20, 176, 194, 194, 102, 62, 44,
    89, 48, 122, 163, 78, 28, 242, 74, 14, 169, 203, 130, 18, 135, 200, 126, 8,
    192, 182,
  ];
  const name = await Name.from(new Uint8Array(bytes));
  const revision = await Name.resolve(name);
  const nextValue = `/ipfs/${rootCid}`;
  const nextRevision = await Name.increment(revision, nextValue);
  await Name.publish(nextRevision, name.key);
}
