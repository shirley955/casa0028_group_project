import './About.css'

export default function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div>
          <p className="about-eyebrow">About GatherHub</p>
          <h1 className="about-title">A food-focused platform for understanding community spaces as shared resources.</h1>
          <p className="about-subtitle text-muted">
            GatherHub brings together venue information and event information in one place, so residents and organisers can move more easily between spaces, activities, and local opportunities for food sharing. The project also asks whether these connections can become part of a broader urban commons.
          </p>
        </div>

        <div className="content-card about-hero-card">
          <h3>What the platform supports</h3>
          <ul className="about-list">
            <li>Find shared kitchens, halls, and community venues that can support food-related activities.</li>
            <li>Browse local events and see which spaces they are connected to.</li>
            <li>Compare places not only by location, but also by how they may support gathering and participation.</li>
            <li>Add new events to strengthen the link between community activity and real spaces.</li>
            <li>Reflect on what kinds of rules, relationships, and responsibilities would be needed for shared use over time.</li>
          </ul>
        </div>
      </section>

      <section className="content-card about-commons">
        <div className="about-commons-intro">
          <p className="about-eyebrow">Urban commons framing</p>
          <h2>From public access to shared stewardship</h2>
          <p>
            Urban commons are not simply public spaces. A commons needs three elements to work together: a resource, a community that uses or contributes to it, and a form of governance that shapes how access, care, and responsibility are organised.
          </p>
          <p>
            In this sense, GatherHub is not only a directory of kitchens and events. It is a prototype for thinking about how food spaces, activities, and local participants might become connected through more durable forms of shared use.
          </p>
        </div>

        <div className="about-commons-grid">
          <article>
            <span className="about-step">01</span>
            <h3>Resource</h3>
            <p>
              The project surfaces physical spaces such as kitchens, halls, and venues, alongside event opportunities and the data layer that links them on the map.
            </p>
          </article>

          <article>
            <span className="about-step">02</span>
            <h3>Community</h3>
            <p>
              The users are not a single group. They include organisers, venue holders, participants, and community groups, forming a network around food-related activity.
            </p>
          </article>

          <article>
            <span className="about-step">03</span>
            <h3>Governance</h3>
            <p>
              This is the key question for future development: who sets the rules, who can use a space, and how shared resources are maintained beyond one-off bookings.
            </p>
          </article>
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

      <section className="about-shift">
        <div className="about-shift-header">
          <p className="about-eyebrow">What this could become</p>
          <h2>Moving beyond one-off matching</h2>
          <p>
            The current prototype mostly helps users find spaces and events. A stronger commons-oriented version would move from simple matching toward shared rules, contribution, and longer-term relationships.
          </p>
        </div>

        <div className="about-shift-grid">
          <article className="content-card about-card">
            <h3>From matching to co-governance</h3>
            <p>
              Instead of only asking where an event can happen, future versions could ask who decides access rules, whether community projects are prioritised, and how commercial or private uses are balanced.
            </p>
          </article>

          <article className="content-card about-card">
            <h3>From space use to resource sharing</h3>
            <p>
              A shared kitchen could be treated less as a rentable room and more as a resource system, where people contribute time, food, knowledge, or care in exchange for access and participation.
            </p>
          </article>

          <article className="content-card about-card">
            <h3>From events to ongoing networks</h3>
            <p>
              Events are currently represented as individual listings. Over time, they could become recurring groups, community clusters, and relationships between organisers, venues, and participants.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
