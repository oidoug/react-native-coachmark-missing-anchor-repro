# react-native-coachmark missing anchor repro

Minimal Expo app for a bug in [`@edwardloopez/react-native-coachmark`](https://github.com/edwardloopez/react-native-coachmark) 0.5.4.

When the anchor of a tour step is missing, the tour stays up as a full-screen dim with no tooltip. With `nextOnBackdropPress: false` it swallows every tap, and only an app restart gets out of it.

## Run

```sh
npm install
npx expo start
```

Open it in Expo Go, a simulator, or press `w` for web.

## Scenarios

`Tap counter` shows whether touches reach the app. Every tour here uses `nextOnBackdropPress: false`.

| Button | What it does | 0.5.4 |
|---|---|---|
| 1. Healthy tour | Anchor stays mounted | Works |
| 2. Anchor never mounted | Step id has no `CoachmarkAnchor` | Stuck dim, no tooltip |
| 3. Anchor unmounts in the same commit as start() | `start()` and the anchor removal are batched | Stuck dim, no tooltip |
| 4. Anchor mounts 500ms after start() | Anchor registers after the lookup | Stuck dim, no tooltip |

Reload the app after each stuck scenario. The status line shows taps, `isActive`, and the last `onFinish` reason.

## Branches

- `main`: published 0.5.4, shows the bug.
- `with-fix`: same app with the proposed fix as a vendored tarball in `vendor/`. Run `npm install` again after switching.
