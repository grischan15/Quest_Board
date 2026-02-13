import { useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import Heatmap from './Heatmap';
import LineChart from './LineChart';
import EnergyCurve from './EnergyCurve';
import ProjectCard from './ProjectCard';
import { getProjectStatus } from '../data/projectHelpers';
import './PersonalDashboard.css';

export default function PersonalDashboard({ tasks, skills, projects }) {
  const [viewMode, setViewMode] = useState('weeks');
  const { heatmapData, lineChartData, energyCurveData, hasDoneTasks } = useDashboardData(tasks, viewMode);

  if (!hasDoneTasks) {
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-content">
          <h2 className="dashboard-title">Dein Dashboard</h2>
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon">&#128202;</div>
            <div className="dashboard-empty-title">Noch keine Daten</div>
            <div className="dashboard-empty-text">
              Schliesse deine ersten Quests ab, um hier deine persoenlichen Analytics zu sehen:
              Heatmap, Fortschritts-Diagramm und Energiekurve.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeProjects = (projects || []).filter((p) => {
    const status = getProjectStatus(p, skills || []);
    return status !== 'done';
  });

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-content">
        <h2 className="dashboard-title">Dein Dashboard</h2>

        {activeProjects.length > 0 && (
          <section className="dashboard-section">
            <h3 className="dashboard-section-title">Projekt-Fortschritt</h3>
            <p className="dashboard-section-desc">Deine aktiven Projekte und ihr Fortschritt</p>
            <div className="dashboard-projects-grid">
              {activeProjects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  skills={skills || []}
                  compact
                />
              ))}
            </div>
          </section>
        )}

        <section className="dashboard-section">
          <h3 className="dashboard-section-title">Deine Energiekurve</h3>
          <p className="dashboard-section-desc">
            Dein persoenlicher Rhythmus &ndash; berechnet aus deinen echten Quest-Daten.
            Plane deine Quests passend zu deinen produktivsten Zeiten!
          </p>
          <div className="dashboard-card">
            <EnergyCurve {...energyCurveData} />
          </div>
        </section>

        <section className="dashboard-section">
          <h3 className="dashboard-section-title">Fortschritt ueber Zeit</h3>
          <p className="dashboard-section-desc">Abgeschlossene Quests nach Typ</p>
          <div className="dashboard-card">
            <LineChart
              {...lineChartData}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </section>

        <section className="dashboard-section">
          <h3 className="dashboard-section-title">Aktivitaets-Heatmap</h3>
          <p className="dashboard-section-desc">Wann schliesst du deine Quests ab?</p>
          <div className="dashboard-card">
            <Heatmap {...heatmapData} />
          </div>
        </section>
      </div>
    </div>
  );
}
