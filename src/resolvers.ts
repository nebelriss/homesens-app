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
    }),
    addData: async(_, {
      sensorId,
      locationId,
      temperature,
      humidity,
      barometricPressure
    }) => await prisma.data.create({
      data: {
        sensor: {
          connect: {
            id: sensorId
          }
        },
        location: {
          connect: {
            id: locationId
          }
        },
        temperature,
        humidity,
        barometricPressure
      }
    })
  }
};

export default resolvers;
