import './About.css'

export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div>
          <p className="about-eyebrow">About GatherHub</p>
          <h1 className="about-title">A food-focused platform for discovering community spaces and events.</h1>
          <p className="about-subtitle text-muted">
            GatherHub brings together venue information and event information in one place, so residents and organisers can move more easily between spaces, activities, and local opportunities for food sharing.
          </p>
        </div>

        <div className="content-card about-hero-card">
          <h3>What you can do here</h3>
          <ul className="about-list">
            <li>Browse community venues with map-based exploration.</li>
            <li>Compare food-related events and see where they are hosted.</li>
            <li>Open venue detail pages before deciding where to go or what to organise.</li>
            <li>Submit a new event and link it to a real place in the platform.</li>
          </ul>
        </div>
      </section>

      <section className="about-grid">
        <article className="content-card about-card">
          <h3>Why this matters</h3>
          <p>
            Community kitchens, church halls, centres, and shared spaces often hold important local activity, but the information is fragmented across different platforms. GatherHub makes those resources easier to find and compare.
          </p>
        </article>

        <article className="content-card about-card">
          <h3>How spaces and events connect</h3>
          <p>
            Events are not shown as isolated listings. Each one is linked back to a venue, so users can understand both what is happening and where it takes place.
          </p>
          <div className="about-flow">
            <span className="about-flow-chip">Explore spaces</span>
            <span className="about-flow-chip">Open event details</span>
            <span className="about-flow-chip">View venue</span>
          </div>
        </article>

        <article className="content-card about-card">
          <h3>Designed for users</h3>
          <p>
            The interface is designed for residents looking for meals and workshops, organisers comparing spaces, and local groups who want a clearer route from venue discovery to event planning.
          </p>
        </article>

        <article className="content-card about-card">
          <h3>What the current prototype focuses on</h3>
          <p>
            This final version prioritises food-led community activity. The events page now highlights cooking classes, supper clubs, and shared meals that better match the wider GatherHub theme.
          </p>
        </article>
      </section>
    </main>
  )
}
