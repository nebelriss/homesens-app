import { IResolvers } from "apollo-server-express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resolvers: IResolvers = {
  Query: {
    sensors: async () => await prisma.sensor.findMany(),
    locations: async () => await prisma.location.findMany(),
  },
  Mutation: {
    addSensor: async (_, { modelName }) => await prisma.sensor.create({
      data: {
        modelName
      }
    }),
    addLocation: async(_, { name, locationType }) => await prisma.location.create({
      data: {
        name,
        locationType
      }
    })
  }
};

export default resolvers;
