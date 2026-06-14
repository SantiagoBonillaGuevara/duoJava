const BadgeIcon = ({ currentLevel }) => {
  return (
    <div
      className="level-badge"
      style={{
        backgroundColor: `${currentLevel?.badgeColor || "#6324eb"}15`,
        border: `1px solid ${currentLevel?.badgeColor || "#6324eb"}30`,
      }}
    >
      <span
        className="material-symbols-outlined text-4xl filled-icon"
        style={{ color: currentLevel?.badgeColor || "#6324eb" }}
      >
        {currentLevel?.badgeIcon || "military_tech"}
      </span>
    </div>
  );
};

export default BadgeIcon;
