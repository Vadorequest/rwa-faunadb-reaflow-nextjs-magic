import { PortData } from 'reaflow';
import { v1 as uuid } from 'uuid'; // XXX Use v1 for uniqueness - See https://www.sohamkamani.com/blog/2016/10/05/uuid1-vs-uuid4/

/**
 * Creates a new port and returns it.
 *
 * @param portData
 */
export const createPort = (portData?: Partial<PortData>): PortData => {
  let { id = uuid() } = portData || {};

  const newPort = {
    ...portData,
    id,
  };
  console.log('newPort', newPort);

  return newPort as PortData;
};
