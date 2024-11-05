import EventEmitter from 'events';

class AIEmitter extends EventEmitter {}

const aiEventEmitter = new AIEmitter();

export default aiEventEmitter;
