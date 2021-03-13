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

While working on this project, I've reached several milestones with a different set of features, available as "Examples":

1. [`with-local-storage`](https://github.com/Vadorequest/poc-nextjs-reaflow/tree/with-local-storage)
   ([Demo](https://poc-nextjs-reaflow-git-with-local-storage-ambroise-dhenain.vercel.app/) | [Diff](https://github.com/Vadorequest/poc-nextjs-reaflow/pull/14)):
   The canvas dataset is stored in the browser localstorage. 
   There is no real-time and no authentication.
1. [`with-faunadb-real-time`](https://github.com/Vadorequest/poc-nextjs-reaflow/tree/with-faunadb-real-time) 
   ([Demo](https://poc-nextjs-reaflow-git-with-faunadb-real-time-ambroise-dhenain.vercel.app/) | [Diff](https://github.com/Vadorequest/poc-nextjs-reaflow/pull/13)): 
   The canvas dataset is stored in FaunaDB. 
   Changes to the canvas are real-time and shared with everyone. 
   Everybody shares the same working document.
1. [`with-magic-link-auth`](https://github.com/Vadorequest/poc-nextjs-reaflow/tree/with-magic-link-auth) 
   ([Demo](https://poc-nextjs-reaflow-git-with-magic-link-auth-ambroise-dhenain.vercel.app/) | [Diff](https://github.com/Vadorequest/poc-nextjs-reaflow/pull/15)): 
   The canvas dataset is stored in FaunaDB. 
   Changes to the canvas are real-time and shared with everyone. 
   Everybody shares the same working document.
   Users can create an account and login using Magic Link, but they still share the same Canvas document as guests.

## Getting started

- `yarn`
- `yarn start`
- Run commands in `fql/setup.js` from the Web Shell at [https://dashboard.fauna.com/](https://dashboard.fauna.com/), this will create the FaunaDB collection, indexes, roles, etc.
- `cp .env.local.example .env.local`, and define your environment variables
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

---

# Inspirations

Here is a list of online resources and open-source repositories that have been the most helpful:

**Understanding FaunaDB:**
- https://fauna.com/blog/modernizing-from-postgresql-to-serverless-with-fauna-part-1

**Authentication and authorization:**
- https://docs.fauna.com/fauna/current/tutorials/basics/authentication?lang=javascript
- https://magic.link/posts/todomvc-magic-nextjs-fauna (tuto Magic + Next.js + FaunaDB)
    - https://github.com/magiclabs/example-nextjs-faunadb-todomvc (repo)
    
**Real-time streaming:**
- https://github.com/fauna-brecht/fauna-streaming-example Very different from what is built here, but holds solid foundations about streaming
  - https://github.com/fauna-brecht/fauna-streaming-example/blob/776c911eb4/src/data/streams.js

**Real-world apps (RWA):**
- https://docs.fauna.com/fauna/current/start/apps/fwitter
- https://github.com/fauna-brecht/skeleton-auth
- https://github.com/fillipvt/with-graphql-faunadb-cookie-auth
- https://github.com/fauna-brecht/fauna-streaming-example
- https://github.com/magiclabs/example-nextjs-faunadb-todomvc

**FQL:**
- UDF
  - https://docs.fauna.com/fauna/current/security/roles API definitions for CRUD ops
- https://github.com/shiftx/faunadb-fql-lib
- https://docs.fauna.com/fauna/current/cookbook/?lang=javascript
- https://github.com/fauna-brecht/faunadb-auth-skeleton-frontend/blob/default/fauna-queries/helpers/fql.js

**GQL:**
- https://css-tricks.com/instant-graphql-backend-using-faunadb/
- https://github.com/ptpaterson/faunadb-graphql-schema-loader
- https://github.com/Plazide/fauna-gql-upload
- Schema management
  - https://github.com/fillipvt/with-graphql-faunadb-cookie-auth/blob/master/scripts/uploadSchema.js

**DevOps:**
- https://github.com/fauna-brecht/fauna-schema-migrate

**Community resources:**
- https://github.com/n400/awesome-faunadb
  - https://gist.github.com/BrunoQuaresma/0236aff64dc44795f19994cbc7a07db6 React query hook
  - https://gist.github.com/tovbinm/f76bcbf56ea8e2e3740e237b6c2f2ab9 GraphQL relation query examples
  - https://gist.github.com/TracyNgot/291738b403cfa012fe7bf05614c22408 Query builder

---

# Real-time implementation, limits, and considerations for the future

The way the current real-time feature is implemented is not too bad, but not great either.

It works by synching the whole dataset whether the remote `document` (on FaunaDB) is updated, which in turn updates all subscribed clients.
While this works, work from one client can be overwritten by another when they happen at the same time. 

> `document` means "Canvas Dataset" here. It contains all `nodes` and `edges` (and other props, like `owner`, etc.)

A better implementation would be not to stream the actual `document`, but only the document's **patches**.
The whole `document` would only be useful for the initialization of the app. 
Then, any change should be streamed to another document which would only contain the changes applied to the initial document.
When such changes are streamed (patches), they should then be applied to the current working document, one by one, in order.

Each change/patch would represent a diff between the previous and after states of the document, they would only contain **what** have changed:
- A node has been added
- An edge has been deleted
- An edge has been modified

This way, when something changes, the client would resolve what's changed and stream the patch to the DB, which in turn would update all subscribed clients which would apply that patch.

Conflict may still arise, but they'll be limited to parts of the document that have been updated simultaneously (the same node, the same edge, etc.).

This would provide a much better user experience, because overwrites will happen much less often, and it'd increase collaboration.
