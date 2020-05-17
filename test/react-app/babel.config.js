module.exports = {
  plugins: [
    [
      "module-resolver",
      {
        root: ["."],
        alias: {
          "mailosaur-cypress": `../../`
        }
      }
    ]
  ]
};
