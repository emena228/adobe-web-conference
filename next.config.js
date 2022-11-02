const path = require("path");
const withImages = require("next-images");

const {
  VERCEL_GITHUB_COMMIT_SHA,
  VERCEL_GITLAB_COMMIT_SHA,
  VERCEL_BITBUCKET_COMMIT_SHA,
} = process.env;

const COMMIT_SHA =
  VERCEL_GITHUB_COMMIT_SHA ||
  VERCEL_GITLAB_COMMIT_SHA ||
  VERCEL_BITBUCKET_COMMIT_SHA;

const resourcesConfig = {
  loader: "sass-resources-loader",
  options: {
    sourceMap: true,
    resources: [path.resolve(__dirname, "styles", "variables.scss")],
  },
};

module.exports = withImages({
  target: "experimental-serverless-trace",
  future: {
    webpack5: true,
  },
  poweredByHeader: false,
  // env: {
  //   SITE_URL: process.env.SITE_URL,
  //   NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
  //   AGORA_APP_ID: process.env.NEXT_PUBLIC_AGORA_APP_ID,
  //   AGORA_APP_LOG: process.env.NEXT_PUBLIC_AGORA_APP_LOG,
  //   AGORA_APP_TOKEN: process.env.AGORA_APP_TOKEN,
  //   OKTA_DOMAIN: process.env.OKTA_DOMAIN,
  //   OKTA_CLIENT_ID: process.env.NEXT_PUBLIC_OKTA_CLIENT_ID,
  //   CAPTCHA_KEY: process.env.NEXT_PUBLIC_CAPTCHA_KEY,
  //   PUB_NUB_PUBLISH: process.env.NEXT_PUBLIC_PUB_NUB_PUBLISH,
  //   PUB_NUB_SUBSCRIBE: process.env.NEXT_PUBLIC_PUB_NUB_SUBSCRIBE,
  //   VERCEL_GITHUB_COMMIT_SHA,
  //   VERCEL_GITLAB_COMMIT_SHA,
  //   VERCEL_BITBUCKET_COMMIT_SHA,
  // },
  inlineImageLimit: 16384,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias["~"] = path.resolve(__dirname);
    config.resolve.alias["@utils"] = path.resolve(__dirname + "/utils");
    config.resolve.alias["@redux"] = path.resolve(__dirname + "/redux");
    config.resolve.alias["@images"] = path.resolve(__dirname + "/images");
    config.resolve.alias["@scss"] = path.resolve(__dirname + "/styles");
    config.resolve.alias["@components"] = path.resolve(
      __dirname + "/components"
    );
    config.resolve.alias["@helpers"] = path.resolve(__dirname + "/helpers");

    // Modify loaders
    for (let i = config.module.rules.length - 1; i > -1; i--) {
      const rule = config.module.rules[i];

      if (rule.oneOf) {
        for (let j = 0; j < rule.oneOf.length; j++) {
          const inner = rule.oneOf[j];
          // Add scss resources
          if (String(inner.test).indexOf("scss") > -1) {
            if (Array.isArray(inner.use)) {
              inner.use.push(resourcesConfig);
            }
          }
        }
      }
    }

    config.plugins.push(
      new webpack.IgnorePlugin(/mariasql/, /\/knex\//),
      new webpack.IgnorePlugin(/mssql/, /\/knex\//),
      new webpack.IgnorePlugin(/mysql/, /\/knex\//),
      new webpack.IgnorePlugin(/mysql2/, /\/knex\//),
      new webpack.IgnorePlugin(/oracle/, /\/knex\//),
      new webpack.IgnorePlugin(/oracledb/, /\/knex\//),
      new webpack.IgnorePlugin(/pg-query-stream/, /\/knex\//),
      new webpack.IgnorePlugin(/sqlite3/, /\/knex\//),
      new webpack.IgnorePlugin(/strong-oracle/, /\/knex\//),
      new webpack.IgnorePlugin(/pg-native/, /\/pg\//)
    );

    return config;
  },
});
