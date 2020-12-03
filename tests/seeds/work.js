export const NewWork = {
  _id: 'simple-work',
  type: 'EXTERNAL',
  created: new Date().getTime(),
  scheduled: new Date('2030/10/01').getTime(),
  priority: 100,
  retries: 3,
  status: 'NEW',
  worker: 'TEST-GRAPHQL',
};

export const AllocatedWork = {
  ...NewWork,
  scheduled: new Date('2030/11/01').getTime(),
  status: 'ALLOCATED',
  _id: 'allocated-work',
};

export default async function seedWorkQueue(db) {
  await db.collection('work_queue').findOrInsertOne(NewWork);
  await db.collection('work_queue').findOrInsertOne(AllocatedWork);
}
