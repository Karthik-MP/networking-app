import React, { useEffect } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';

// Invisible component that runs ImageManipulator's hook-based API and
// calls back with the manipulation result. Use this inside a React component
// where hooks are allowed.
export default function ImageProcessor({
  source,
  actions = [{ resize: { width: 500 } }],
  saveOptions = { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true },
  onProcessed,
  onError,
}) {
  const context = ImageManipulator.useImageManipulator(source);

  useEffect(() => {
    let mounted = true;
    if (!source) return () => {};

    (async () => {
      try {
        // Apply actions
        for (const action of actions) {
          if ('resize' in action) context.resize(action.resize);
          else if ('rotate' in action) context.rotate(action.rotate);
          else if ('flip' in action) context.flip(action.flip);
          else if ('crop' in action) context.crop(action.crop);
        }

        const image = await context.renderAsync();
        const result = await image.saveAsync(saveOptions);

        // free resources
        try { context.release(); } catch (e) {}
        try { image.release(); } catch (e) {}

        if (!mounted) return;
        onProcessed && onProcessed(result);
      } catch (e) {
        if (!mounted) return;
        onError && onError(e);
      }
    })();

    return () => { mounted = false; };
  }, [source]);

  return null;
}
