import React from 'react';

// Next.js keeps `jsx: preserve` in tsconfig so its own compiler owns the JSX
// transform. The test loader has no such step and falls back to the classic
// runtime, which emits bare `React.createElement` calls. Theme components do
// not import React themselves, so the classic runtime needs it in scope.
// Import this module before any component under test.
(globalThis as { React?: typeof React }).React = React;
