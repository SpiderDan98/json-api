import JsonApi from "./JsonApi";

const start = new Date();

const paginationJsonApi = new JsonApi().setMeta({
  pagination: {
    current: 1,
    next: 2,
  },
});

const userJsonApi = paginationJsonApi.setJsonApi({ version: "1.0" });

userJsonApi
  .fromNormalData([
    {
      id: "1",
      name: "SpiderDan98",
      email: "danielkemna@t-online.de",
      posts: [
        {
          id: "1",
          message: "hello",
          comment: {
            id: "1",
            text: "Moin meister",
          },
        },
      ],
    },
    {
      id: "2",
      name: "Test",
      email: "test@test.de",
      posts: [
        {
          id: "1",
          message: "hello",
          comment: {
            id: "1",
            text: "Moin meister",
          },
        },
      ],
    },
  ])
  .setType("users");

console.log(JSON.stringify(userJsonApi.toJsonApiJson(), null, 2));
userJsonApi.toJsonApiJson();

const fromJsonApiData = new JsonApi().fromJsonApiData({
  jsonapi: {
    version: "1.0",
  },
  meta: {
    pagination: {
      current: 1,
      next: 2,
    },
  },
  data: [
    {
      id: "1",
      type: "users",
      attributes: {
        name: "SpiderDan98",
        email: "danielkemna@t-online.de",
      },
      relationships: [
        {
          data: {
            id: "1",
            type: "posts",
          },
        },
      ],
    },
    {
      id: "2",
      type: "users",
      attributes: {
        name: "Test",
        email: "test@test.de",
      },
      relationships: [
        {
          data: {
            id: "1",
            type: "posts",
          },
        },
      ],
    },
  ],
  included: [
    {
      id: "1",
      type: "posts",
      attributes: {
        message: "hello",
      },
      relationships: [
        {
          data: {
            id: "1",
            type: "comment",
          },
        },
      ],
    },
    {
      id: "1",
      type: "comment",
      attributes: {
        text: "Moin meister",
      },
    },
  ],
});

console.log(JSON.stringify(fromJsonApiData.toDataJson(), null, 2));
fromJsonApiData.toDataJson();

const errorJsonApi = new JsonApi().fromJsonApiData({
  errors: [
    {
      status: "403",
      source: { pointer: "/data/attributes/secretPowers" },
      detail: "Editing secret powers is not authorized on Sundays.",
    },
    {
      status: "422",
      source: { pointer: "/data/attributes/volume" },
      detail: "Volume does not, in fact, go to 11.",
    },
    {
      status: "500",
      source: { pointer: "/data/attributes/reputation" },
      title: "The backend responded with an error",
      detail: "Reputation service not responding after three requests.",
    },
    {
      status: "343",
      source: { pointer: "/errors/moin/meister" },
      detail: "Moin meister",
    },
  ],
});

console.log(JSON.stringify(errorJsonApi.toErrorJson(), null, 2));
//errorJsonApi.toErrorJson()

const end = new Date();

console.log(`${end.getMilliseconds() - start.getMilliseconds()} ms`);
