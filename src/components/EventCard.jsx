// 活动卡片
// 被 Events.jsx 使用

// 依旧显示筛选后结果。


export default function EventCard({ data, onClick }) {
  if (!data) return null;

  return (
    <div className="card" onClick={() => onClick(data)}>
      <div className="card-image"></div>

      <div className="card-body">
        <p className="card-tag">{data.event_category}</p>

        <h3>{data.title}</h3>

        <p className="card-time">{data.start_time || "TBC"}</p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(data);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}