# POC Next.js + Reaflow

> This project is a POC of [Reaflow](https://github.com/reaviz/reaflow) used with the Next.js framework. It is hosted on Vercel.

It is a single-page application (using a static page) that aims at showing an **advanced use-case with Reaflow**.

## Online demo

[Demo](https://poc-nextjs-reaflow.vercel.app/) (automatically updated from the `master` branch).

![image](https://user-images.githubusercontent.com/3807458/109431687-08bf1680-7a08-11eb-98bd-31fa91e21680.png)

## Features

It comes with the following features:
- Source code heavily **documented**
- Strong TS typings
- Different kinds of node (`start`, `if`, `information`, `question`) with different layouts for each type _(see [NodeRouter component](blob/main/src/components/nodes/NodeRouter.tsx))_
- Nodes use `foreignObject`, which complicates things quite a bit (events, css), but it's the only way of writing HTML/CSS within an SVG `rect` (custom nodes UI)
- Advanced support for **`foreignObject`** and best-practices
- Support for **Emotion 11**
- Reaflow Nodes, Edges and Ports are properly extended (**BaseNode** component, **BaseNodeData** type, **BaseEdge** component, **BaseEdgeData** type, etc.), 
  which makes it easy to quickly change the properties of all nodes, edges, ports, etc.
- Creation of nodes through the `BlockPickerMenu` component, which displays either at the bottom of the canvas, or at the mouse pointer position (e.g: when dropping edges)
- **Undo/redo** support (with shortcuts)
- Node/edge **deletion**
- Node **duplication**
- **Selection** of nodes and edges, one at a time 
- Uses **`Recoil`** for shared state management
- Automatically re-calculate the **height** of nodes when jumping lines in `textarea`
- ~~Graph data (nodes, edges) are **persisted** in the browser **localstorage** and automatically loaded upon page reload~~
  - Graph data (nodes, edges) are **persisted** in FaunaDB and automatically loaded upon page reload
- Real-time support for collaboration (open 2 tabs), using FaunaDB
  - FaunaDB token is public and has read/update access rights on one table of the DB only
  - All users share the same "Canvas" document in the DB
  - This POC will **not improve further** the collaborative experience, it's only a POC (undo/redo undoes peer actions, undo/redo seems a bit broken sometimes)

Known limitations:
- Editor direction is `RIGHT` (hardcoded) and adding nodes will add them to the right side, always (even if you change the direction)
    - I don't plan on changing that at the moment

> This POC can be used as a boilerplate to start your own project using Reaflow.

## Variants

While working on this project, I've reached several milestones with a different set of features, in order:

1. [`with-local-storage`](https://github.com/Vadorequest/poc-nextjs-reaflow/tree/with-local-storage) 
   ([Demo](https://poc-nextjs-reaflow-git-with-local-storage-ambroise-dhenain.vercel.app/)): 
   The canvas dataset is stored in the browser localstorage. 
   There is no real-time and no authentication.
1. [`with-faunadb-real-time`](https://github.com/Vadorequest/poc-nextjs-reaflow/tree/with-faunadb-real-time) 
   ([Demo](https://poc-nextjs-reaflow-git-with-faunadb-real-time-ambroise-dhenain.vercel.app/)): 
   The canvas dataset is stored in FaunaDB. 
   Changes to the canvas are real-time and shared with everyone. 
   Everybody shares the same working document.
1. _(Current)_ [`with-magic-link-auth`](https://github.com/Vadorequest/poc-nextjs-reaflow/tree/with-magic-link-auth) 
   ([Demo](https://poc-nextjs-reaflow-git-with-magic-link-auth-ambroise-dhenain.vercel.app/)): 
   The canvas dataset is stored in FaunaDB. 
   Changes to the canvas are real-time and shared with everyone. 
   Authenticated users see their email being displayed and can login/logout but still share the same document as guests.

## Getting started

- `yarn`
- `yarn start`
- Open browser at [http://localhost:8890](http://localhost:8890)

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
