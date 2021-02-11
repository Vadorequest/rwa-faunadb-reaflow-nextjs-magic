# POC Next.js + Reaflow

> This project is a POC of [Reaflow](https://github.com/reaviz/reaflow) used with the Next.js framework. It is hosted on Vercel.

It is a single-page application (using a static page) that aims at showing an **advanced use-case with Reaflow**.

## Online demo

[Demo](https://poc-nextjs-reaflow.vercel.app/) (automatically updated from the `master` branch).

## Features

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
- Graph data (nodes, edges) are persisted in the browser localstorage and loaded upon page reload

Known limitations:
- Editor direction is `RIGHT` (hardcoded) and adding nodes will add them to the right side, always (even if you change the direction)
    - I don't plan on changing that at the moment

> This POC can be used as a boilerplate to start your own project using Reaflow.

## Deploy your own

Deploy the example using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/Vadorequest/poc-nextjs-reaflow&project-name=poc-nextjs-reaflow&repository-name=poc-nextjs-reaflow)

## Advanced - ELK

ELKjs (and ELK) are used to draw the graph (nodes, edges). 
It's what Reaflow uses in the background.
ELK stands for **Eclipse Layout Kernel**.

It seems to be one of the best Layout manager out there.

Unfortunately, it is quite complicated and lacks a comprehensive documentation.

You'll need to dig into the ELK documentation and issues if you're trying to change **how the graph's layout behaves**. 
Here are some good places to start and useful links I've compiled for my own sake.

- [ELKjs GitHub](https://github.com/kieler/elkjs)
- [ELK official website](https://www.eclipse.org/elk/)
- [ELK Demonstrators](https://rtsys.informatik.uni-kiel.de/elklive/index.html)
  - [Tool to convert `elkt <=> json` both ways](https://rtsys.informatik.uni-kiel.de/elklive/conversion.html)
  - [Tool to convert `elkt` to a graph](https://rtsys.informatik.uni-kiel.de/elklive/elkgraph.html)
  - [Java ELK implementation of the `layered` algorithm](https://github.com/eclipse/elk/tree/master/plugins/org.eclipse.elk.alg.layered/src/org/eclipse/elk/alg/layered/p2layers)
  - [Community examples soure code](https://github.com/eclipse/elk-models/tree/master/examples) _(which are displayed on [ELK examples](https://rtsys.informatik.uni-kiel.de/elklive/examples.html))_
  - [Klayjs example](http://kieler.github.io/klayjs-d3/examples/interactive) (ELK is the sucessor of KlayJS and [should support the same options](https://github.com/kieler/elkjs/issues/122#issuecomment-777781503))
- [Issues opened by Austin](https://github.com/kieler/elkjs/issues?q=is%3Aissue+sort%3Aupdated-desc+author%3Aamcdnl)
- [Issues opened by Vadorequest](https://github.com/kieler/elkjs/issues?q=is%3Aissue+sort%3Aupdated-desc+author%3Avadorequest)

Known limitations:
- [Tracking issue - Manually positioning the nodes ("Standalone Edge Routing")](https://github.com/eclipse/elk/issues/315)
