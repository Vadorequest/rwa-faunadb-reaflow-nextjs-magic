import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import cloneDeep from 'lodash.clonedeep';
import now from 'lodash.now';
import React from 'react';
import {
  Edge,
  EdgeChildProps,
} from 'reaflow';
import {
  SetterOrUpdater,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { absoluteLabelEditorState } from '../../states/absoluteLabelEditorStateState';
import { blockPickerMenuSelector } from '../../states/blockPickerMenuState';
import { canvasDatasetSelector } from '../../states/canvasDatasetSelector';
import { edgesSelector } from '../../states/edgesState';
import { lastCreatedState } from '../../states/lastCreatedState';
import { selectedEdgesSelector } from '../../states/selectedEdgesState';
import { selectedNodesSelector } from '../../states/selectedNodesState';
import BaseEdgeData from '../../types/BaseEdgeData';
import BaseEdgeProps, { PatchCurrentEdge } from '../../types/BaseEdgeProps';
import BaseNodeData from '../../types/BaseNodeData';
import BasePortData from '../../types/BasePortData';
import BlockPickerMenu, { OnBlockClick } from '../../types/BlockPickerMenu';
import { CanvasDataset } from '../../types/CanvasDataset';
import { LastCreated } from '../../types/LastCreated';
import NodeType from '../../types/NodeType';
import { translateXYToCanvasPosition } from '../../utils/canvas';
import {
  createNodeFromDefaultProps,
  getDefaultNodePropsWithFallback,
  upsertNodeThroughPorts,
} from '../../utils/nodes';
import Label from './Label';

type Props = {} & BaseEdgeProps;

/**
 * Base edge component.
 *
 * This component contains shared business logic common to all edges.
 * It renders a Reaflow <Edge> component.
 *
 * The Edge renders itself as SVG <g> HTML element wrapper, which contains the <path> HTML element that displays the link itself.
 *
 * @see https://reaflow.dev/?path=/story/demos-edges
 */
const BaseEdge: React.FunctionComponent<Props> = (props) => {
  const {
    id,
    source: sourceNodeId,
    sourcePort: sourcePortId,
    target: targetNodeId,
    targetPort: targetPortId,
  } = props;

  const [blockPickerMenu, setBlockPickerMenu] = useRecoilState<BlockPickerMenu>(blockPickerMenuSelector);
  const [canvasDataset, setCanvasDataset] = useRecoilState(canvasDatasetSelector);
  const [edges, setEdges] = useRecoilState(edgesSelector);
  const { nodes } = canvasDataset;
  const setLastCreatedNode: SetterOrUpdater<LastCreated | undefined> = useSetRecoilState(lastCreatedState);
  const { displayedFrom, isDisplayed } = blockPickerMenu;
  const edge: BaseEdgeData = edges.find((edge: BaseEdgeData) => edge?.id === id) as BaseEdgeData;
  const [selectedEdges, setSelectedEdges] = useRecoilState(selectedEdgesSelector);
  const [selectedNodes, setSelectedNodes] = useRecoilState(selectedNodesSelector);
  const setAbsoluteLabelEditor = useSetRecoilState(absoluteLabelEditorState);

  if (typeof edge === 'undefined') {
    return null;
  }

  // Resolve instances of connected nodes and ports
  const sourceNode: BaseNodeData | undefined = nodes.find((node: BaseNodeData) => node.id === sourceNodeId);
  const sourcePort: BasePortData | undefined = sourceNode?.ports?.find((port: BasePortData) => port.id === sourcePortId);
  const targetNode: BaseNodeData | undefined = nodes.find((node: BaseNodeData) => node.id === targetNodeId);
  const targetPort: BasePortData | undefined = targetNode?.ports?.find((port: BasePortData) => port.id === targetPortId);
  const isSelected = !!selectedEdges?.find((selectedEdge: string) => selectedEdge === edge.id);

  // console.log('edgeProps', props);

  /**
   * Invoked when clicking on the "+" of the edge.
   *
   * Displays the BlockPickerMenu, which can then be used to select which Block to add to the canvas.
   * If the BlockPickerMenu was already displayed, hides it if it was opened from the same edge.
   *
   * When a block is clicked, the "onBlockClick" function is invoked and creates (upserts) the node
   * by splitting the edge in two parts and adding the new node in between.
   *
   * @param event
   */
  const onAddIconClick = (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
    const onBlockClick: OnBlockClick = (nodeType: NodeType) => {
      const newNode: BaseNodeData = createNodeFromDefaultProps(getDefaultNodePropsWithFallback(nodeType));
      const newDataset: CanvasDataset = upsertNodeThroughPorts(cloneDeep(nodes), cloneDeep(edges), edge, newNode);

      setCanvasDataset(newDataset);
      setLastCreatedNode({ node: newNode, at: now() });
      setSelectedNodes([newNode?.id]);
      setSelectedEdges([]);
    };

    // Converts the x/y position to a Canvas position and apply some margin for the BlockPickerMenu to display on the right bottom of the cursor
    const [x, y] = translateXYToCanvasPosition(event.clientX, event.clientY, { left: 15, top: 15 });

    setBlockPickerMenu({
      displayedFrom: `edge-${edge.id}`,
      // Toggles on click if the source is the same, otherwise update
      isDisplayed: displayedFrom === `edge-${edge.id}` ? !isDisplayed : true,
      onBlockClick,
      eventTarget: event.target,
      top: y,
      left: x,
    });
  };

  /**
   * Invoked when clicking on the "-" of the edge.
   *
   * Removes the selected edge.
   *
   * @param event
   */
  const onRemoveIconClick = (event: React.MouseEvent<SVGGElement, MouseEvent>): void => {
    console.log('onRemoveIconClick', event, edge);
    setEdges(edges.filter((edge: BaseEdgeData) => edge.id !== id));
  };

  /**
   * Selects the edge when clicking on it.
   *
   * XXX We're resolving the "edge" ourselves, instead of relying on the 2nd argument (edgeData),
   *  which doesn't contain all the expected properties. It is more reliable to use the current edge, which already known.
   *
   * @param event
   * @param data_DO_NOT_USE
   */
  const onEdgeClick = (event: React.MouseEvent<SVGGElement, MouseEvent>, data_DO_NOT_USE: BaseEdgeData) => {
    console.log('onEdgeClick', event, edge);
    setSelectedEdges([edge.id]);
  };

  /**
   * Path the properties of the current node.
   *
   * Only updates the provided properties, doesn't update other properties.
   * Also merges the 'data' object, by keeping existing data and only overwriting those that are specified.
   *
   * XXX Make sure to call this function once per function call, otherwise only the last patch call would be persisted correctly
   *  (multiple calls within the same function would be overridden by the last patch,
   *  because the "node" used as reference wouldn't be updated right away and would still use the same (outdated) reference)
   *  TLDR; Don't use "patchCurrentNode" multiple times in the same function, it won't work as expected
   *
   * @param patch
   */
  const patchCurrentEdge: PatchCurrentEdge = (patch: Partial<BaseEdgeData>): void => {
    const edgeToUpdateIndex = edges.findIndex((edge: BaseEdgeData) => edge.id === id);
    const existingEdge: BaseEdgeData = edges[edgeToUpdateIndex];
    const edgeToUpdate = {
      ...existingEdge,
      ...patch,
      id: existingEdge.id, // Force keep same id to avoid edge cases
    };
    console.log('patchCurrentEdge before', existingEdge, 'after:', edgeToUpdate, 'using patch:', patch);

    const newEdges = cloneDeep(edges);
    // @ts-ignore
    newEdges[edgeToUpdateIndex] = edgeToUpdate;

    setEdges(newEdges);
  };

  return (
    <Edge
      {...props}
      label={<Label />}
      className={classnames(`edge-svg-graph`, { 'is-selected': isSelected })}
      onClick={onEdgeClick}
    >
      {
        (edgeChildProps: EdgeChildProps) => {
          const {
            center,
          } = edgeChildProps;

          // Improve centering (because we have 3 icons), and position the foreignObject children above the line
          const x = (center?.x || 0) - 25;
          const y = (center?.y || 0) - 25;

          const onLabelSubmit = (value: string) => {
            console.log('value', value);

            patchCurrentEdge({
              text: value || ' ', // Use a space as default, to increase the distance between nodes, which ease edge's selection
            });
          };

          const onStartLabelEditing = (event: React.MouseEvent<SVGGElement, MouseEvent>) => {
            setAbsoluteLabelEditor({
              x: center?.x,
              y: center?.y,
              defaultValue: edge?.text,
              onSubmit: onLabelSubmit,
              isDisplayed: true,
            });
          };

          return (
            <foreignObject
              id={`edge-foreignObject-${edge.id}`}
              className={classnames(`edge-container`, {
                'is-selected': isSelected,
              })}
              width={100} // Content width will be limited by the width of the foreignObject
              height={60}
              x={x}
              y={y}
              css={css`
                position: relative;
                color: black;
                z-index: 1;

                .edge {
                  // XXX Elements within a <foreignObject> that are using the CSS "position" attribute won't be shown properly, 
                  //  unless they're wrapped into a container using a "fixed" position.
                  //  Solves the display of React Select element.
                  // See https://github.com/chakra-ui/chakra-ui/issues/3288#issuecomment-776316200
                  position: fixed;
                }

                .svg-inline--fa {
                  cursor: pointer;
                }
              `}
            >
              {
                isSelected && (
                  <div className={'edge'}>
                    <FontAwesomeIcon
                      icon={['fas', 'search-plus']}
                      onClick={onAddIconClick}
                    />

                    <FontAwesomeIcon
                      icon={['fas', 'search-minus']}
                      onClick={onRemoveIconClick}
                    />

                    <FontAwesomeIcon
                      icon={['fas', 'edit']}
                      onClick={onStartLabelEditing}
                    />
                  </div>
                )
              }
            </foreignObject>
          );
        }
      }
    </Edge>
  );
};

export default BaseEdge;
