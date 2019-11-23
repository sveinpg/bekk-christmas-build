const NetlifyAPI = require("netlify");
const client = new NetlifyAPI(process.env.NETLIFY_ACCESS_TOKEN);

const includedSites = [
  "security-christmas",
  "product-christmas",
  "css-christmas",
  "ux-christmas",
  "ml-christmas",
  "thecloud-christmas",
  "java-christmas",
  "functional-christmas",
  "javascript-christmas",
  "kotlin-christmas",
  "react-christmas",
  "opensource-christmas",
  "bekk-christmas"
];

client
  .listSites()
  .then(sites =>
    sites.map(site => ({
      id: site.id,
      name: site.name
    }))
  )
  .then(sites => {
    sites.forEach(site => {
      if (includedSites.includes(site.name)) {
        client.listSiteDeploys({ site_id: site.id }).then(deploys => {
          const newestDeploy = deploys.sort((a, b) =>
            b.created_at.localeCompare(a.created_at)
          )[0];
          if (newestDeploy.state === "ready") {
            client.restoreSiteDeploy({
              site_id: site.id,
              deploy_id: newestDeploy.id
            });
          }
        });
      }
    });
  });
