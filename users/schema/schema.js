const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLEnumType,
} = require('graphql');
const _ = require('lodash');
const axios = require('axios').default;

// const users = [
//   {
//     id: '1',
//     firstName: 'Chandu',
//     age: 20,
//   },
//   {
//     id: '2',
//     firstName: 'Raju',
//     age: 21,
//   },
// ];

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    // user: {
    //   type: UserType,
    //   async resolve(parentValue, args) {
    //     const res = await axios.get(
    //       `http://localhost:3000/companies/${parentValue.id}/users`
    //     );
    //     return res.data;
    //   },
    // },
  },
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLString,
      // resolve(parentValue, args) {
      //   // console.log('CHANDU', args);
      // },
    },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      //not working with nested objects
      // fields: {
      //   id: {
      //     type: GraphQLString,
      //     resolve() {
      //       console.log('INSIDE RESOLVE ID');
      //     },
      //   },
      // },
      async resolve(parentValue, args) {
        // console.log(parentValue, args);
        const res = await axios.get(
          `http://localhost:3000/companies/${parentValue.companyId}`
        );
        return res.data;
      },
    },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: {
          type: GraphQLString,
        },
        // firstName: {
        //   type: GraphQLString,
        // },
      },
      async resolve(parentValue, args) {
        // console.log(args);
        // return _.find(users, { id: args.id });
        const res = await axios.get(`http://localhost:3000/users/${args.id}`);
        // console.log(res.data);
        return res.data;
      },
    },
    company: {
      type: CompanyType,
      args: {
        id: {
          type: GraphQLString,
        },
      },
      async resolve(parentValue, args) {
        // console.log(args);
        // return _.find(users, { id: args.id });
        const res = await axios.get(
          `http://localhost:3000/companies/${args.id}`
        );
        console.log(res.data);
        return res.data;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
