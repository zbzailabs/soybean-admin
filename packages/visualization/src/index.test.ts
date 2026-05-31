import { describe, expect, it } from 'vitest';
import { filterSceneByStatus, normalizeScene, sampleDataScreenScene } from './index';

describe('visualization scene helpers', () => {
  it('normalizes node radius and edge particle rate from data scale', () => {
    const normalized = normalizeScene(sampleDataScreenScene);

    expect(normalized.nodes.every(node => node.radius >= 0.28)).toBe(true);
    expect(normalized.edges.every(edge => edge.particleRate >= 1)).toBe(true);
  });

  it('filters nodes, edges, and alerts by status', () => {
    const filtered = filterSceneByStatus(sampleDataScreenScene, ['critical']);

    expect(filtered.nodes.map(node => node.id)).toEqual(['database']);
    expect(filtered.edges).toEqual([]);
    expect(filtered.alerts.map(alert => alert.nodeId)).toEqual(['database']);
  });
});
