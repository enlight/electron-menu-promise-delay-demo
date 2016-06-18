# electron-menu-promise-delay-demo
Demo of delayed promise execution in Electron menu item `click` handlers

![Screen capture of demo app](/demo.gif?raw=true "Demo")

## Setup

Install the dependencies for the demo app:

```shell
npm install
```

Then run it:

```shell
npm start
```

## Observations

These observations were made on a system running:

- Windows 8.1 x64
- Electron v1.2.3 x64 and v0.36.11 x64

Promises in Electron menu item `click` handlers don't appear to be executed
until the mouse cursor is moved or the page is clicked on. In this demo app
it is sufficient to move the mouse cursor on the page ever so slightly, but
in another app of mine the cursor must be moved off the page completely.

This app creates a window/app menu where each item sends an IPC message to
the renderer process, which in turn displays the message on the index page.
The menu items are described below.

### `PromiseFirst` Menu
The first item in this menu sends the IPC message from inside a promise, while
the last item sends the message directly. Clicking on the `Ping Promise` item
will have no visible effect until the mouse cursor is moved or the page is
clicked on.

### `PromiseLast` Menu
The first item in this menu sends the IPC message directly, while the last item
sends the message from inside a promise. Oddly enough clicking on the `Ping
Promise` item in this menu will in fact have an immediate effect.

### `PromiseLastNotWorking` Menu
This menu is setup exactly the same as the `PromiseLast` menu, but clicking on
the `Ping Promise` item in this menu will not have an immediate effect!

### `JustPromises` Menu
This menu only contains items that send IPC messages from inside promises,
clicking on either item has no effect until the mouse cursor is moved or the
page is clicked on.

### `Workaround` Menu
In this menu the promises within the `click` handlers are wrapped in calls
to `setImmediate()` or `process.nextTick()`, this seems to ensure that the
promises are executed in a timely manner.

## Additional Notes

While this app only creates a window/app menu the `click` handlers in context
menu items appear to suffer from exactly the same issue.
