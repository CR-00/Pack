const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function getRandomRoute() {
  let pins = [];
  for (let i = 0; i < Math.random() * 10; i++) {
    pins.push({
      lat: (Math.random() * (90 - -90) + -90).toFixed(3) * 1,
      lng: (Math.random() * (180 - -180) + -180).toFixed(3) * 1,
    });
  }
  return pins;
}

const dropAll = async () => {
  const deleteEvents = prisma.event.deleteMany();
  const deleteDescriptions = prisma.eventDescription.deleteMany();
  const deleteCoordinates = prisma.coordinate.deleteMany();
  const deleteKit = prisma.kitItem.deleteMany();
  await prisma.$transaction([
    deleteDescriptions,
    deleteCoordinates,
    deleteKit,
    deleteEvents,
  ]);
};

const seed = async () => {
  for (let i = 0; i < 100; i++) {
    await prisma.event
      .create({
        data: {
          creator: {
            connect: {
              email: process.env.SEED_EMAIL,
            },
          },
          description: {
            create: {
              difficulty: Math.floor(1 + Math.random() * 4),
              activity: "hiking",
              name: "An Event",
              start: "2022-11-08T00:00:00.000Z",
              end: "2022-11-17T00:00:00.000Z",
              description: "test",
            },
          },
          coordinates: {
            create: getRandomRoute(),
          },
          kitItems: {
            create: [
              {
                name: "tent",
                capacity: 1 + Math.floor(Math.random() * 4),
                owner: {
                  connect: {
                    email: process.env.SEED_EMAIL,
                  },
                },
              },
            ],
          },
          attendees: {
            create: [
              {
                user: {
                  connect: {
                    email: process.env.SEED_EMAIL
                  }
                },
                status: "ACCEPTED"
              }
            ]
          }
        },
      })
      .then((res) => console.log(res));
  }
};

dropAll();
seed();
