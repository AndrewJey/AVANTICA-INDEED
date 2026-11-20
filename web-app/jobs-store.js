/* AVANTICA-INDEED — Motor persistente de bolsa de empleo y seguimiento de postulaciones */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) module.exports = factory();
  else root.AvanticaJobsStore = factory();
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var STORAGE_KEY = 'avantica_indeed_v1';
  var SEED_JOBS = [
    { id: 'job-1', title: 'Senior Full-Stack Engineer (.NET / React)', company: 'Avantica / Encora', location: 'San José, CR', modality: 'Remoto', salaryUsd: 4800, stack: 'C#, .NET, React, Azure', postedAt: '2026-11-18' },
    { id: 'job-2', title: 'Backend Java Cloud Developer', company: 'Avantica / Encora', location: 'Alajuela, CR', modality: 'Híbrido', salaryUsd: 4200, stack: 'Java 17, Spring Boot, PostgreSQL', postedAt: '2026-11-17' },
    { id: 'job-3', title: 'QA Automation Engineer', company: 'Indeed Partner Labs', location: 'Heredia, CR', modality: 'Remoto', salaryUsd: 3400, stack: 'Playwright, TypeScript, CI/CD', postedAt: '2026-11-16' },
    { id: 'job-4', title: 'DevOps & Kubernetes Engineer', company: 'Avantica Cloud', location: 'Cartago, CR', modality: 'Presencial', salaryUsd: 4600, stack: 'Docker, Kubernetes, Terraform, AWS', postedAt: '2026-11-15' }
  ];

  function createStore(storageAdapter) {
    var storage = storageAdapter || (typeof localStorage !== 'undefined' ? localStorage : null);
    var state = load();

    function load() {
      if (storage) {
        try {
          var parsed = JSON.parse(storage.getItem(STORAGE_KEY) || 'null');
          if (parsed && Array.isArray(parsed.jobs)) {
            return { jobs: parsed.jobs, savedIds: Array.isArray(parsed.savedIds) ? parsed.savedIds : [], applications: Array.isArray(parsed.applications) ? parsed.applications : [] };
          }
        } catch (e) {}
      }
      return { jobs: SEED_JOBS.slice(), savedIds: ['job-1'], applications: [] };
    }

    function persist() {
      if (!storage) return;
      try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    }

    function getState() { return JSON.parse(JSON.stringify(state)); }

    function filterJobs(opts) {
      var o = opts || {};
      var q = String(o.query || '').trim().toLowerCase();
      var mod = String(o.modality || '').trim();
      var minSal = Number(o.minSalary) || 0;
      return state.jobs.filter(function (j) {
        if (mod && j.modality !== mod) return false;
        if (minSal > 0 && (Number(j.salaryUsd) || 0) < minSal) return false;
        if (q) {
          var hay = (j.title + ' ' + j.company + ' ' + j.location + ' ' + j.stack).toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      });
    }

    function addJob(input) {
      var title = String((input && input.title) || '').trim();
      var company = String((input && input.company) || '').trim();
      if (!title || !company) return { ok: false, error: 'Título y empresa son obligatorios.' };
      var job = {
        id: 'job-' + Date.now().toString(36),
        title: title,
        company: company,
        location: String((input && input.location) || 'Costa Rica').trim(),
        modality: String((input && input.modality) || 'Remoto').trim(),
        salaryUsd: Math.max(0, Number(input && input.salaryUsd) || 0),
        stack: String((input && input.stack) || '').trim(),
        postedAt: new Date().toISOString().slice(0, 10)
      };
      state.jobs.unshift(job);
      persist();
      return { ok: true, job: job };
    }

    function toggleSave(jobId) {
      var i = state.savedIds.indexOf(jobId);
      if (i >= 0) state.savedIds.splice(i, 1);
      else state.savedIds.push(jobId);
      persist();
      return state.savedIds.indexOf(jobId) >= 0;
    }

    function applyToJob(jobId, candidateName, email) {
      var name = String(candidateName || '').trim();
      var mail = String(email || '').trim();
      if (!name || mail.indexOf('@') <= 0) return { ok: false, error: 'Nombre y correo válidos son requeridos.' };
      var job = state.jobs.find(function (j) { return j.id === jobId; });
      if (!job) return { ok: false, error: 'Vacante no encontrada.' };
      var app = { id: 'app-' + Date.now().toString(36), jobId: jobId, jobTitle: job.title, company: job.company, candidateName: name, email: mail, status: 'Postulado', createdAt: new Date().toISOString() };
      state.applications.unshift(app);
      persist();
      return { ok: true, application: app };
    }

    return { getState: getState, filterJobs: filterJobs, addJob: addJob, toggleSave: toggleSave, applyToJob: applyToJob };
  }

  return { STORAGE_KEY: STORAGE_KEY, SEED_JOBS: SEED_JOBS, createStore: createStore };
});
