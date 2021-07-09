// eslint-disable-next-line import/no-extraneous-dependencies
import 'graphql-import-node';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'apollo-server-express';
import * as typeDefs from './schema/schema.graphql';
import resolvers from './resolvers';

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
