# POC Next.js + Reaflow

> This project is a POC of [Reaflow](https://github.com/reaviz/reaflow) used with the Next.js framework. It is hosted on Vercel.

It is a single-page application (using a static page) that aims at showing an **advanced use-case with Reaflow**.

It comes with the following features:
- Source code heavily documented
- Strong TS typings
- Different kinds of node (`information`, `question`) with different layouts for each type _(see [NodeRouter component](blob/main/src/components/nodes/NodeRouter.tsx))_
- Nodes use `foreignObject`, which complicates things quite a bit (events, css), but it's the only way of writing HTML/CSS within a SVG `rect`
- Advanced support for `foreignObject` and best-practices
- Support for Emotion 11
- Reaflow Nodes, Edges and Ports are properly extended (BaseNode component, BaseNodeData type, BaseEdge component, BaseEdgeData type, etc.), 
  which makes it easy to quickly change the properties of all nodes, edges, ports, etc.
- Creation of nodes through the `BlockPickerMenu` component, which displays either at the bottom of the canvas, or at the mouse pointer position (e.g: when dropping edges)
- Undo/redo support (with shortcuts)
- Node deletion
- Selection of element (nodes, edges) _(**WIP**, implementation might be completely changed in the future)_
- Uses `Recoil` for shared state management
- Automatically re-calculate the height of nodes when jumping lines in `textarea`

Known limitations:
- Editor direction is `RIGHT` (hardcoded) and adding nodes will add them to the right side, always (even if you change the direction)
    - I don't plan on changing that at the moment

> This POC can be used as a boilerplate to start your own project using Reaflow.

## Online demo

[Demo](https://poc-nextjs-reaflow.vercel.app/) (automatically updated from the `master` branch).

## Deploy your own

Deploy the example using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/Vadorequest/poc-nextjs-reaflow&project-name=poc-nextjs-reaflow&repository-name=poc-nextjs-reaflow)

