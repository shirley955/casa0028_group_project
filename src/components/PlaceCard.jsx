// 页面下面那个place查看，一个可以点进detail的中介卡片
// 用在explore.jsx里做组件
// 可以用地点照片当封面之类的？

// Card → 先 Modal → 再决定是否进 Detail。如果直接进detail会打断探索流。
// 离开地图、丢失空间上下文，很难回到刚才筛选状态，决策成本太高

// Card 不是所有数据列表而是筛选后的结果，
// [Filters] → 筛选
// Map（显示结果）
// Card list（同步结果）

// 这里主要是用做对比面板，可以直接点进最详细的页面里
// popup也可以一路进入最详细页，但不适合用来对比（要一个一个地点看），card可以提供这个功能。

import './PlaceCard.css'

export default function PlaceCard({ data, onClick }) {
  if (!data) return null;

  const displayName =
    data.card_name ||
    data.card_type?.replace(/_/g, " ") ||
    "Community space";

  const category =
    data.card_type?.replace(/_/g, " ") || "Community space";

  const postcode =
    data.meta?.card_postcode || "No postcode";

  return (
    <div className="place-card" onClick={() => onClick(data)}>

      {/* ⭐ image / placeholder */}
      <div className="place-card-image-wrap">
        {data.image ? (
          <img
            src={data.image}
            alt={displayName}
            className="place-card-image"
          />
        ) : (
          <div className="place-card-image-placeholder">
            Image coming soon
          </div>
        )}
      </div>

      {/* ⭐ body */}
      <div className="place-card-body">
        <p className="place-card-category">{category}</p>

        <h3>{displayName}</h3>

        <p className="place-card-location">{postcode}</p>

        <button
          className="btn-primary"
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