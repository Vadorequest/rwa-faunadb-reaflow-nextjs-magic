import { PortData } from 'reaflow';
import BaseNodeType from './BaseNodeType';

export type BaseNodeDefaultProps = {
  type: BaseNodeType;
  defaultWidth: number;
  defaultHeight: number;
  ports: PortData[];
}
