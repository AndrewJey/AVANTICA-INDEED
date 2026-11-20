import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const S = require('../jobs-store.js');

function memStorage() {
  const m = new Map();
  return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) };
}

test('filters, saves, creates jobs, and persists applications', () => {
  const stg = memStorage();
  const store = S.createStore(stg);
  assert.equal(store.filterJobs({ modality: 'Remoto' }).length, 2);
  assert.equal(store.filterJobs({ minSalary: 4500 }).length, 2);

  const created = store.addJob({ title: 'AI Engineer', company: 'Avantica', modality: 'Remoto', salaryUsd: 5200 });
  assert.equal(created.ok, true);
  assert.equal(store.toggleSave(created.job.id), true);

  assert.equal(store.applyToJob(created.job.id, 'Ana', 'bad-email').ok, false);
  const app = store.applyToJob(created.job.id, 'Ana Mora', 'ana@cr.dev');
  assert.equal(app.ok, true);

  const store2 = S.createStore(stg);
  assert.equal(store2.getState().applications.length, 1);
  assert.ok(store2.getState().jobs.some(j => j.id === created.job.id));
});
