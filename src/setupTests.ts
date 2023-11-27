import { configureToMatchImageSnapshot } from "jest-image-snapshot";
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';

global.React = React; // this also works for other globally available libraries

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  // customDiffConfig: { threshold: 0.1 },
  failureThreshold: 0.01,
  failureThresholdType: "percent",
  noColors: true,
});

expect.extend({ toMatchImageSnapshot });
