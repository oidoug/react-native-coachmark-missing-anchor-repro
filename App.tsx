import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  CoachmarkAnchor,
  CoachmarkOverlay,
  CoachmarkProvider,
  useCoachmark,
  type Plugin,
  type Tour,
} from '@edwardloopez/react-native-coachmark';

const tip = (key: string, id: string): Tour => ({
  key,
  nextOnBackdropPress: false,
  steps: [{ id, title: 'Tip', description: `Spotlight on "${id}"` }],
});

function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

function Home({ lastFinish }: { lastFinish: string }) {
  const { start, isActive } = useCoachmark();
  const [taps, setTaps] = useState(0);
  const [showAnchor, setShowAnchor] = useState(true);
  const [showLateAnchor, setShowLateAnchor] = useState(false);

  return (
    <View style={styles.screen}>
      <Text style={styles.status}>
        Taps: {taps} | tour active: {String(isActive)} | {lastFinish}
      </Text>

      <Button label="Tap counter" onPress={() => setTaps((n) => n + 1)} />

      <Button
        label="1. Healthy tour"
        onPress={() => start(tip('healthy', 'always-mounted'))}
      />

      <Button
        label="2. Anchor never mounted"
        onPress={() => start(tip('never-mounted', 'does-not-exist'))}
      />

      <Button
        label="3. Anchor unmounts in the same commit as start()"
        onPress={() => {
          start(tip('same-commit', 'unmounts'));
          setShowAnchor(false);
        }}
      />

      <Button
        label="4. Anchor mounts 500ms after start()"
        onPress={() => {
          start(tip('late', 'late'));
          setTimeout(() => setShowLateAnchor(true), 500);
        }}
      />

      <View style={styles.anchors}>
        <CoachmarkAnchor id="always-mounted" style={styles.anchor}>
          <Text>always-mounted</Text>
        </CoachmarkAnchor>

        {showAnchor && (
          <CoachmarkAnchor id="unmounts" style={styles.anchor}>
            <Text>unmounts</Text>
          </CoachmarkAnchor>
        )}

        {showLateAnchor && (
          <CoachmarkAnchor id="late" style={styles.anchor}>
            <Text>late</Text>
          </CoachmarkAnchor>
        )}
      </View>
    </View>
  );
}

export default function App() {
  const [lastFinish, setLastFinish] = useState('no tour finished yet');
  const [plugins] = useState<Plugin[]>(() => [
    {
      onFinish: (tour, reason) => setLastFinish(`${tour.key}: ${reason}`),
    },
  ]);

  return (
    <CoachmarkProvider plugins={plugins}>
      <Home lastFinish={lastFinish} />
      <CoachmarkOverlay />
    </CoachmarkProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 12, padding: 24, paddingTop: 72 },
  status: { fontSize: 14, fontWeight: '600' },
  button: { backgroundColor: '#007AFF', borderRadius: 8, padding: 14 },
  buttonLabel: { color: '#fff', fontSize: 15, textAlign: 'center' },
  anchors: { flexDirection: 'row', gap: 12, marginTop: 24 },
  anchor: { backgroundColor: '#E5E5EA', borderRadius: 8, padding: 12 },
});
