export default {
  providers: [
    {
      domain: process.env.NODE_ENV === "production" 
        ? "https://ireporter-new.netlify.app" 
        : process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
