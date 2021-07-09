import { IResolvers } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});

const resolvers: IResolvers = {
  Query: {
    sensor: async (_, { id }) =>
      await prisma.sensor.findUnique({
        where: { id: Number(id) },
      }),
    sensors: async () => await prisma.sensor.findMany(),
    location: async (_, { id }) =>
      await prisma.location.findUnique({
        where: { id: Number(id) },
      }),
    locations: async () => await prisma.location.findMany(),
    allData: async (_, { sensorId, locationId, from, to, skip, take }) => {
      const whereArgs = { where: {} };
      const skipArgs = !skip ? {} : { skip };
      const takeArgs = !take ? {} : { take };
      const dateArgs: { [k: string]: any } = {};

      if (sensorId) {
        whereArgs.where = {
          ...whereArgs.where,
          sensor: {
            id: Number(sensorId),
          },
        };
      }

      if (locationId) {
        whereArgs.where = {
          ...whereArgs.where,
          location: { id: Number(locationId) },
        };
      }

      // not the best
      if (to || from) {
        if (to) dateArgs.lte = new Date(to);
        if (from) dateArgs.gte = new Date(from);

        whereArgs.where = {
          ...whereArgs.where,
          createdAt: {
            ...dateArgs,
          },
        };
      }

      return await prisma.data.findMany({
        ...skipArgs,
        ...takeArgs,
        where: {
          ...whereArgs.where,
        },
        include: {
          location: true,
          sensor: true,
        },
      });
    },
    latestDataByLocations: async () => {
      // Inefficient by it works for this case
      // get all locations
      const locations = await prisma.location.findMany();

      // get latest for every location
      const data = [];
      for (const location of locations) {
        const res = await prisma.data.findFirst({
          where: { location: { id: location.id } },
          include: { location: true },
          orderBy: { createdAt: "desc" },
        });
        data.push(res);
      }
      return data;
    },
  },

  Mutation: {
    addSensor: async (_, { modelName }) =>
      await prisma.sensor.create({
        data: {
          modelName,
        },
      }),
    updateSensor: async (_, { id, modelName }) =>
      await prisma.sensor.update({
        where: { id: Number(id) },
        data: { modelName },
      }),
    addLocation: async (_, { name, locationType }) =>
      await prisma.location.create({
        data: {
          name,
          locationType,
        },
      }),
    updateLocation: async (_, { id, name, locationType }) =>
      await prisma.location.update({
        where: { id: Number(id) },
        data: {
          name,
          locationType,
        },
      }),
    addData: async (
      _,
      { sensorId, locationId, temperature, humidity, barometricPressure },
    ) =>
      await prisma.data.create({
        data: {
          sensor: {
            connect: {
              id: sensorId,
            },
          },
          location: {
            connect: { id: locationId },
          },
          temperature,
          humidity,
          barometricPressure,
        },
      }),
  },
};

export default resolvers;
