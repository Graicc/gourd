# Gourd

[Gourd](https://gourd-ten.vercel.app) is an experiment in place imbued with computation.

A place is a specific location where an activity can occour.
Thus Gourd is a single location. All users share the Gourd. There cannot be a private room because there is only one Gourd, in the same way that there is only one [Central Park](https://en.wikipedia.org/wiki/Central_Park).

For Gourd to be useful, a shared canvas is not enough. Users must be able to evaulate code. Gourd supports running [Python](https://www.python.org/).

Working together in physical space allows knowledge to be diffused by passive interactions. When you go by someone, you can see what they're doing, and it is very easy to start talking about it.
When people are isolated, these interactions can't happen. You'd have actively reach out and ask what someone is up to, which is unlikely to happen.

Gourd is inspired by:

- [Pastagang: Jamming together far apart](https://www.pastagang.cc/paper/)
- [Bret Victor: The Humane Representation of Thought](https://dynamicland.org/2014/The_Humane_Representation_of_Thought/)
- Minecraft redstone servers (everyone shares a server, they can have their own plots of land to build on, but you can visit anyone at any time)
- [Natto](https://natto.dev/). This is actually very similar (but not multiplayer (I think), not a place, and js). I wish I knew it existed before starting this.
- Long living, shared Google Docs
- [Google collab](https://colab.research.google.com/) / [Marimo](https://marimo.io/). These have the code execution part, but not the multiplayer and place part. Gourd is on a canvas because it provides more room to work in than a linear document. You can't "go off into a corner" and work on something in a linear document, but you can when there are 2 dimensions.

## How?

- [tldraw](https://tldraw.dev/) for the canvas and multiplayer
- [CodeMirror](https://codemirror.net/) for the code editor (it's what [Marimo](https://marimo.io/) uses)
- [Pyodide](https://pyodide.org/en/stable/) to run python in the browser
- [Next.JS](https://nextjs.org/) as the React framework
- [Vercel](https://vercel.com/) for hosting

## Current status? Roadmap?

On hold pending some time to prioritize it and a real usecase where multiple people would work on one task.

Executing code blocks is working, but I still need to have some way to plumb values between code blocks (this also requires serailizing values so that they actually exist to python and aren't just the displayed results), and probably a way to export items to the global scope.
Ideally, youd be able to draw a box around things to group their exports into a namespace. If any of this sounds interesting, feel free to contribute it.
