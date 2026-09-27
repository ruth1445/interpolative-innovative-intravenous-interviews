/* Copy this file, rename it to the person's slug, then add one import
   and one entry in interviews/index.js. */
export default {
  slug: "new-person",
  named: true,
  name: "New Person",

  /* Optional bouquet overrides. */
  shape: "cosmos",
  colour: 0,

  /* Remove `soon:true` when the interview is ready to publish. */
  soon: true,

  press: {
    kicker: "",
    shout: ""
  },

  story: [
    { p: `Start the interview here.` }
  ]
};
