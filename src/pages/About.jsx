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
          <h3>What the platform supports</h3>
          <ul className="about-list">
            <li>Find shared kitchens, halls, and community venues that can support food-related activities.</li>
            <li>Browse local events and see which spaces they are connected to.</li>
            <li>Compare places not only by location, but also by how they may support gathering and participation.</li>
            <li>Add new events to strengthen the link between community activity and real spaces.</li>
          </ul>
        </div>
      </section>

      <section className="about-grid">
        <article className="content-card about-card">
          <h3>Why this matters</h3>
          <p>
            Shared kitchens, church halls, and community centres are more than venues. They can support everyday food practices, hosting, and social connection. But when information about these places and their events is hard to find, opportunities for participation and local belonging are easy to miss.
          </p>
        </article>

        <article className="content-card about-card">
          <h3>How spaces and events connect</h3>
          <p>
            Events do not happen in isolation. The venue shapes what kind of gathering is possible, who can access it, and how people experience it. By linking events back to real places, GatherHub helps users make better decisions about where to go, what to join, and what to organise.
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
            The platform is designed for people seeking to take part in food-related activities, organisers identifying appropriate venues, and community groups linking events to spaces. It supports both participation and spatial understanding of local activity, acknowledging that these connections are not always fully visible in existing data.
          </p>
        </article>

        <article className="content-card about-card">
          <h3>What the current prototype focuses on</h3>
          <p>
            This prototype focuses on food-led community activity, especially shared meals, workshops, and small gatherings that can be linked to existing venues. Rather than covering every type of local event, it concentrates on cases where food, space, and participation are closely connected. The current state of this prototype highlights both the potential and the limitations of linking community events to physical spaces, reflecting the fragmented nature of real-world data.
          </p>
        </article>
      </section>
    </main>
  )
}
