import Prismic from "@prismicio/client";

export const apiEndpoint = process.env.PRISMIC_ENDPOINT;
export const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

// Client method to query documents from the Prismic repo
export const Client = (req = null) => Prismic.client(apiEndpoint, createClientOptions(req, accessToken));

const createClientOptions = (req = null, prismicAccessToken = null) => {
  const reqOption = req ? { req } : {};
  const accessTokenOption = prismicAccessToken ? { accessToken: prismicAccessToken } : {};
  return {
    ...reqOption,
    ...accessTokenOption,
  };
};

// -- Link resolution rules
// Manages the url links to internal Prismic documents
export const linkResolver = (doc) => {
  if (doc.type === "page") {
    return `/${doc.uid}`;
  }
  return "/";
};

// Additional helper function for Next/Link component
export const hrefResolver = (doc) => {
  if (doc.type === "page") {
    return "/[uid]";
  }
  return "/";
};
