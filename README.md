# RWA FaunaDB + Reaflow + Next.js + Magic link

This project is a Real-World App featuring [FaunaDB](https://fauna.com/) as real-time database, [Reaflow](https://github.com/reaviz/reaflow) as graph editor, and [Magic Link](https://magic.link/) for passwordless authentication.

It also uses the famous Next.js framework, and it's hosted on Vercel.

This RWA is meant to help beginners with any of the above-listed tools learn how to build a real app, using best-practices.
Therefore, the codebase is heavily documented, not only the README but also every file in the project.

The app allows users to create a discussion workflow in a visual way. 
It displays information, questions and branching logic (if/else).
It works in real-time for better collaboration, and provides features similar as if you'd be building a Chatbot discussion.

## You want to learn?

Take a look at the **[Variants](#Variants)** below **before jumping in the source code**.
As part of my developer journey, I've reached different milestones and made different branches/PR for each of them.
If you're only interested in Reaflow, or Magic Auth, or FaunaDB Real-Time streaming, **they'll help you focus on what's of the most interest to you**.

> _If you like what you're seeing, take a look at [Next Right Now](https://github.com/UnlyEd/next-right-now), a **production-grade boilerplate** for the Next.js framework._

## Online demo

[Demo](https://rwa-faunadb-reaflow-nextjs-magic.vercel.app/) (automatically updated from the `master` branch).

![image](https://user-images.githubusercontent.com/3807458/109431687-08bf1680-7a08-11eb-98bd-31fa91e21680.png)

## Features

This RWA comes with the following features:
- Source code heavily **documented**
- Strong TS typings
- **Graph Editor** (Reaflow)
    - Different kinds of node (`start`, `end`, `if`, `information`, `question`) with different layouts for each type _(see [NodeRouter component](blob/main/src/components/nodes/NodeRouter.tsx))_
    - Nodes use `foreignObject`, which complicates things quite a bit (events, css), but it's the only way of writing HTML/CSS within an SVG `rect` (custom nodes UI)
    - Advanced support for **`foreignObject`** and best-practices
    - Native Reaflow Nodes, Edges and Ports are extended for reusability _(**BaseNode** component, **BaseNodeData** type, **BaseEdge** component, **BaseEdgeData** type, etc.)_,
        which makes it easy to quickly change the properties of all nodes, edges, ports, etc.
    - Creation of nodes visually, through the `BlockPickerMenu` component
    - **Undo/redo** support (with shortcuts)
    - Node/edge **deletion**
    - Node **duplication**
    - **Selection** of nodes and edges (one at a time)
    - Automatically re-calculate the **height** of nodes when jumping lines in `textarea`
        - _This is much harder than it might look like, because it triggers concurrent state updates that need to be [queued](./src/utils/canvasDatasetMutationsQueue.ts) so we don't lose part of the changes_
- **Shared state manager**
    - Uses **`Recoil`**
        - It was my first time using Recoil, and I like it even more than I thought I would. It's very easy to use.
        - The one thing that needs improvement are DevTools, it's not as powerful as other state manager have (Redux, MobX, etc.).
          There are only few tools out there, and even fewer are compatible with Next.js.
    - [recoil-devtools](https://github.com/ulises-jeremias/recoil-devtools) available (hit `(ctrl/cmd)+h`)
- Passwordless Authentication (Magic Link)
  - Use Next.js API endpoint to authenticate the user securely
  - Stores a `token` cookie that can only be read/written from the server side (`httpOnly`)
  - Use `/api/login` endpoint that reads the token on the server side and returns its content, used by the frontend to know if the current user is authenticated
- **Real-time DB (FaunaDB)**
  - Graph data _(nodes, edges, AKA `CanvasDataset`)_ are **persisted** in FaunaDB and automatically loaded upon page load
  - Real-time stream for collaboration (open 2 tabs)
    - When **not authenticated** (AKA "Guest"):
      - FaunaDB token is public and has read/write access rights on one special shared document of the "Canvas" collection
        - It cannot read/write anything else in the DB, it's completely safe
      - All guests share the same "Canvas" document in the DB
    - When **authenticated** (AKA "Editor"):
      - A FaunaDB token is generated upon login and stored in the `token` cookie. This token is linked to the user and hold the **permissions** granted to the user.
      Therefore, it will only allow what's configured in the FaunaDB "Editor" role.
    - This RWA will **not improve further** the collaborative experience, it's only a POC (undo/redo undoes peer actions)
- Support for **Emotion 11** (CSS in JS)

_Known limitations_:
- Editor direction is `RIGHT` (hardcoded) and adding nodes will add them to the right side, always (even if you change the direction)
    - I don't plan on changing that at the moment

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
1. [`with-faunadb-auth`](https://github.com/Vadorequest/poc-nextjs-reaflow/tree/with-faunadb-auth)
   ([Demo](https://poc-nextjs-reaflow-git-with-faunadb-auth-ambroise-dhenain.vercel.app/) | [Diff](https://github.com/Vadorequest/poc-nextjs-reaflow/pull/12)):
   The canvas dataset is stored in FaunaDB.
   Changes to the canvas are real-time and shared with everyone when not authenticated.
   Changes to the canvas are real-time and shared with yourself when being authenticated. (open 2 tabs to see it in action)
   Users can create an account and login using Magic Link, they'll automatically load their own document.
1. _(Current)_ [`with-fauna-graphql`](https://github.com/Vadorequest/poc-nextjs-reaflow/tree/with-faunadb-auth)
   ([Demo](poc-nextjs-reaflow-git-with-fauna-graphql-ambroise-dhenain.vercel.app/) | [Diff](https://github.com/Vadorequest/poc-nextjs-reaflow/pull/16)):
   The canvas dataset is stored in FaunaDB.
   Changes to the canvas are real-time and shared with everyone when not authenticated.
   Changes to the canvas are real-time and shared with yourself when being authenticated. (open 2 tabs to see it in action)
   Users can create an account and login using Magic Link, they'll automatically load their own document.
   Added support for quick sync of FaunaDB roles/indexes/data/functions (code as single source of truth) and GraphQL schema upload.
   _This example is also available on the `main` branch._

## Roadmap

Here are the future variants I intend to work on:
- FaunaDB GraphQL (GQL): We currently use FQL to manipule the real-time stream (it's not compatible with GQL).
  I'd like to use GQL for non real-time operations.
  I'm thinking adding the add/edit/remove project features using GQL, to showcase usage of both FaunaDB FQL and GQL languages.
- FaunaDB IaC (Infrastructure as Code): Currently, the FaunaDB configuration is rather "simple", there are 2 tables, 1 index, 2 roles.
  But it's not possible to generate the whole database configuration dynamically in an automated way.
  I'd like to improve the DevOps experience and make it possible to deploy the whole thing in a new DB programmatically.
  Also, I'd like to have proper function splits and unit testing to make the whole project (including roles, queries, indexes, etc.) automatically testable.
  This would greatly increase the developer experience and confidence in our ability to duplicate the project to a new DB and creating different staging/production environments.

External help on those features is much welcome! Please contribute ;)

## Getting started

> If you want to use this project to start your own, you can either clone it using git and run the below commands, or "Deploy your own" using the Vercel button, which will create for you the Vercel and GitHub project (but won't configure environment variables for you!).

- `yarn`
- `yarn start`
- Run commands in `fql/setup.js` from the Web Shell at [https://dashboard.fauna.com/](https://dashboard.fauna.com/), this will create the FaunaDB collection, indexes, roles, etc.
- `cp .env.local.example .env.local`, and define your environment variables
- Open browser at [http://localhost:8890](http://localhost:8890)

If you deploy it to Vercel, you'll need to create Vercel environment variables for your project. (see `.env.local.example` file)

## Deploy your own

Deploy the example using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/Vadorequest/poc-nextjs-reaflow&project-name=poc-nextjs-reaflow&repository-name=poc-nextjs-reaflow)

---

# Advanced

This section is for developers who want to understand even deeper how things work.

## Application overview

Users can be either **Guests** or **Editors**.

All requests to FaunaDB are made **from the frontend**. Even though, **they're completely secure** due to a proper combination of tokens and roles/permissions.

### Guests permissions (FaunaDB)

By default, users are guests. Guests all share the same working document and see changes made by others in real-time. They can only access (read/write) that
special shared document.

Guests use a special FaunaDB token generated from the "Public" role. They all share that same token. The token doesn't expire. Also, the token **only allows
read/write on the special shared document** (ID: "1"), see the `/fql/setup.js` file "Public" role.

Therefore, the public token, even though it's public, cannot be used to perform any other operation than read/write that single document.

### Editors permissions (FaunaDB)

Editors are authenticated users who can only access (read/write) their own documents.

A editor-related token is generated upon successful login and is used in the client to authenticate to FaunaDB. Even though the token is used by the browser,
it's still safe because the token is only readable/writeable from the server. (`httpOnly: true`)

Also, the token won't allow read/write on other documents than their owner, see the `/fql/setup.js` file "Editor" role.

### Authentication (Magic + FaunaDB + Next.js API)

Users authenticate through Magic Link (passwordless) sent to the email they used. Magic helps to simplify the authentication workflow by ensuring the users use
a valid email (they must click on a link sent to their email inbox to log in).

When the user clicks on the link in their inbox, Magic generates a `DID token`, which is then used as authentication `Bearer token` and sent to our `/api/login`
.

The `/api/login` endpoint checks the DID token and then generates a FaunaDB token (`faunaDBToken`) attached to the user. This `faunaDBToken` is then stored in
the `token` cookie (httpOnly), alongside other user-related information (UserSession object), such as their `email` and FaunaDB `ref` and `id`.

This token will then be read (`/api/user` endpoint) when the user loads the page.

_Even though there are 2 buttons (login/create account), both buttons actually do the same thing, and both can be used to sign-in and sign-up. That's because we
automatically log in new users, so whether they were an existing user or not doesn't change the authentication workflow. It made more sense (UX) to have two
different buttons, that's what people usually expect, so we made it that way._

### Workflow editor (Reaflow)

The editor provides a GUI allowing users to add "nodes" and "edges" connecting those nodes. It is meant to help them **build a workflow** using nodes such as "
Information", "Question" and "If/Else".

The workflow in itself **doesn't do anything**, it's purely visual. It typically represents a discussion a user would have with a Chatbot.

The whole app only use one page, that uses Next.js SSG mode (it's statically rendered, and the page is generated at build time, when deploying the app).

### Real-time streaming (FaunaDB)

Once the user session has been fetched (through `/api/user`), the `CanvasContainer` is rendered. One of its child component, `CanvasStream` automatically opens
a stream connection to FaunaDB on the user's document (the shared document if **Guest**, or the first document that belongs to the **Editor**).

When the stream is opened, it automatically retrieves the current state of the document and updates the local state (Recoil).

When changes are made on the document, FaunaDB send a push notification to all users subscribed to that document. This also happens when the user X updates the
document (they receives a push notification if they're the author of the changes, too). In such case, the update is being ignored for performances reasons (we
don't need to update a local state that is already up-to-date).

## Reaflow Graph (ELK)

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

**FaunaDB Real-world apps (RWA):**
- https://docs.fauna.com/fauna/current/start/apps/fwitter
- https://github.com/fauna-brecht/skeleton-auth
- https://github.com/fillipvt/with-graphql-faunadb-cookie-auth
- https://github.com/fauna-brecht/fauna-streaming-example
- https://github.com/magiclabs/example-nextjs-faunadb-todomvc

**FaunaDB FQL:**
- UDF
  - https://docs.fauna.com/fauna/current/security/roles API definitions for CRUD ops
- https://github.com/shiftx/faunadb-fql-lib
- https://docs.fauna.com/fauna/current/cookbook/?lang=javascript
- https://github.com/fauna-brecht/faunadb-auth-skeleton-frontend/blob/default/fauna-queries/helpers/fql.js

**FaunaDB GQL:**
- https://css-tricks.com/instant-graphql-backend-using-faunadb/
- https://github.com/ptpaterson/faunadb-graphql-schema-loader
- https://github.com/Plazide/fauna-gql-upload
- Schema management
  - https://github.com/fillipvt/with-graphql-faunadb-cookie-auth/blob/master/scripts/uploadSchema.js

**FaunaDB DevOps:**
- https://github.com/fauna-brecht/fauna-schema-migrate

**FaunaDB Community resources:**
- https://github.com/n400/awesome-faunadb
  - https://gist.github.com/BrunoQuaresma/0236aff64dc44795f19994cbc7a07db6 React query hook
  - https://gist.github.com/tovbinm/f76bcbf56ea8e2e3740e237b6c2f2ab9 GraphQL relation query examples
  - https://gist.github.com/TracyNgot/291738b403cfa012fe7bf05614c22408 Query builder

---

# Real-time implementation, limits, and considerations for the future

The way the current real-time feature is implemented is not too bad, but not great either.

It works by syncing the whole dataset whether the remote `document` (on FaunaDB) is updated, which in turn updates all subscribed clients (except the author).
While this works, changes from one client can be overwritten by another client when they happen at the same time.

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
