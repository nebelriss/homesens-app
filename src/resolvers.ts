import { IResolvers } from "apollo-server-express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resolvers: IResolvers = {
  Query: {
    sensor: async (_, { id }) => await prisma.sensor.findUnique({
      where: { id: Number(id) }
    }),
    sensors: async () => await prisma.sensor.findMany(),
    location: async (_, { id }) => await prisma.location.findUnique({
      where: { id: Number(id) }
    }),
    locations: async () => await prisma.location.findMany(),
  },
  Mutation: {
    addSensor: async (_, { modelName }) => await prisma.sensor.create({
      data: {
        modelName
      }
    }),
    updateSensor: async (_, { id, modelName }) => await prisma.sensor.update({
      where: { id: Number(id) },
      data: { modelName }
    }),
    addLocation: async(_, { name, locationType }) => await prisma.location.create({
      data: {
        name,
        locationType
      }
    }),
    updateLocation: async (_, { id, name, locationType }) => await prisma.location.update({
      where: { id: Number(id) },
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
