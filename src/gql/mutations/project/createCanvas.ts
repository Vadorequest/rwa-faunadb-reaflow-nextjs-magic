import { gql } from 'graphql-request';
import { Canvas } from '../../../types/graphql/graphql';
import canvas from '../../fragments/canvas';

export type CreateCanvasMutationResult = {
  createdCanvas: Canvas;
};

/**
 * Creates a new canvas and links it to the user and project.
 *
 * Uses "createCanvas" mutation, which is automatically created by FaunaDB.
 */
const CREATE_CANVAS = gql`
  mutation CREATE_CANVAS($userId: ID!, $projectId: ID!){
    createdCanvas: createCanvas(data: {
      id: ""
      owner: {
        connect: $userId
      }
      project: {
        connect: $projectId
      }
    }){
      ...canvasFields
    }
  }
  ${canvas.canvasFields}
`;

export default CREATE_CANVAS;
