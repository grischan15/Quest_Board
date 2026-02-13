import { getProjectStatus, getProjectProgress, PROJECT_STATUS_CONFIG } from '../data/projectHelpers';
import './ProjectCard.css';

export default function ProjectCard({ project, skills, compact, onClick }) {
  const status = getProjectStatus(project, skills);
  const progress = getProjectProgress(project, skills);
  const config = PROJECT_STATUS_CONFIG[status];

  if (compact) {
    return (
      <div
        className="project-card project-card-compact"
        onClick={onClick}
        style={{ '--proj-color': config.color, '--proj-bg': config.bg }}
      >
        <span className="project-card-icon">{project.icon}</span>
        <div className="project-card-compact-info">
          <span className="project-card-name">{project.name}</span>
          <div className="project-card-compact-row">
            <div className="project-card-bar">
              <div
                className="project-card-bar-fill"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <span className="project-card-compact-text">
              {progress.met}/{progress.total} Skills
            </span>
          </div>
        </div>
        <span className="project-card-status-icon">{config.icon}</span>
      </div>
    );
  }

  return (
    <div
      className="project-card project-card-full"
      onClick={onClick}
      style={{ '--proj-color': config.color, '--proj-bg': config.bg }}
    >
      <div className="project-card-header">
        <span className="project-card-icon-lg">{project.icon}</span>
        <div className="project-card-header-info">
          <span className="project-card-name">{project.name}</span>
          <span className="project-card-badge" style={{ color: config.color, background: config.bg }}>
            {config.icon} {config.label}
          </span>
        </div>
      </div>
      {project.description && (
        <p className="project-card-desc">{project.description}</p>
      )}
      <div className="project-card-progress">
        <div className="project-card-bar project-card-bar-lg">
          <div
            className="project-card-bar-fill"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <span className="project-card-percent">{progress.percent}%</span>
      </div>
      {project.requirements && project.requirements.length > 0 && (
        <div className="project-card-reqs">
          {project.requirements.map((req) => {
            const skill = skills.find((s) => s.id === req.skillId);
            if (!skill) return null;
            const met = (skill.level || 0) >= req.requiredLevel;
            return (
              <div key={req.skillId} className={`project-card-req ${met ? 'project-card-req-met' : 'project-card-req-unmet'}`}>
                <span className="project-card-req-icon">{met ? '\u2705' : '\u26AA'}</span>
                <span className="project-card-req-name">{skill.name}</span>
                <span className="project-card-req-level">
                  Lv.{skill.level || 0}/{req.requiredLevel}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
