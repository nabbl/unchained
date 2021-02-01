import { WorkerDirector } from 'meteor/unchained:core-worker';
import EventListenerWorker from 'meteor/unchained:core-worker/workers/eventListener';
import IntervalWorker from 'meteor/unchained:core-worker/workers/interval';
import FailedRescheduler from 'meteor/unchained:core-worker/schedulers/failedRescheduler';

export const workerTypeDefs = () => [
  /* GraphQL */ `
    extend enum WorkType {
      ${WorkerDirector.getActivePluginTypes().join(',')}
    }
  `,
];

export default ({ cronText }) => {
  const handlers = [];
  handlers.push(new FailedRescheduler({ WorkerDirector }));
  handlers.push(
    new EventListenerWorker({
      WorkerDirector,
    })
  );
  if (cronText) {
    handlers.push(
      new IntervalWorker({
        WorkerDirector,
        cronText,
      })
    );
  }

  handlers.forEach((handler) => handler.start());
  return handlers;
};
