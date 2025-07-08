module.exports = {
    apps: [
      {
        name: "NodeAPI", // Name of the application
        script: "dist/src/main.js", // Path to your app's entry point (compiled file in case of NestJS)
        args: "run start:dev", // Number of instances (use max for cluster mode)
       }
    ],
  };
  