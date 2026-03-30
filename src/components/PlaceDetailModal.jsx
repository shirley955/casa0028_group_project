// 基础的地点信息，比如位置邮编，有什么设施、具体可用空间多大、照片、booking slote之类的。

//Name、Features、Availability、Upcoming events
// [ View full details ]

//因为有更具体的可booking页面，这个modal要提供不同层级的信息，稍微详细，但不是全部。

// 如果是place拥有者，可以开放在网站booking的权限，可以修改place的具体信息，可以看到申请者的具体信息。
// booking detail
// 基本信息、简短描述、可用性
// Map → Popup → Modal →（继续操作 or 深入页面）

// 和Upcoming events联动，
// 按钮：
// View full details
// Request / Book
// Host event here

export default function PlaceDetailModal({ place, onClose }) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)"
    }}>
      <div style={{
        background: "white",
        padding: "20px",
        margin: "100px auto",
        width: "300px"
      }}>
        <h2>{place.name}</h2>
        <p>Capacity: {place.capacity}</p>

        <button>Request Space</button>
        <button style={{ marginLeft: "10px" }}>
          View Details
        </button>

        <br /><br />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}