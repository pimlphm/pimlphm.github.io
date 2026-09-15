const directions = [
  { title: 'System resilience', detail: 'Fault evolution, risk propagation, recovery optimization and resilience enhancement in complex industrial systems.' },
  { title: 'Trustworthy industrial AI', detail: 'Interpretable and reliable learning methods that combine physical principles, expert knowledge and data.' },
  { title: 'Embodied inspection', detail: 'Autonomous robotic perception, multimodal defect detection, intelligent maintenance and industrial agents.' },
];

const platforms = [
  { number: '01', title: 'AI computing', detail: 'Computing infrastructure for physics-informed machine learning, industrial foundation models, graph neural networks, agents, digital twins and prognostics and health management (PHM).', equipment: 'Dual NVIDIA RTX PRO 6000 GPUs · 96 GB each · 256 GB ECC memory' },
  { number: '02', title: 'Rotating machinery & polymer bearings', detail: 'A custom rotor–bearing platform for fault diagnosis, degradation mechanisms, vibration analysis, multisensor fusion and prognostics.', equipment: 'Variable-speed drive · vibration and temperature interfaces · data acquisition' },
  { number: '03', title: 'Robotic inspection', detail: 'A hexapod platform for autonomous inspection, defect detection and robot-assisted maintenance in simulated industrial environments.', equipment: 'Hiwonder hexapod · RGB-D vision · IMU · vibration, acoustic and temperature sensing' },
  { number: '04', title: 'Rapid fabrication', detail: 'Fabrication of robot components, industrial pipe mock-ups, defect specimens and sensor mounts for laboratory experiments.', equipment: 'Bambu Lab X1 Carbon / P1S · engineering plastics · carbon-fibre-reinforced materials' },
];

export default function Pyrenees() {
  return (
    <section className="lab-section" id="pyrenees" aria-labelledby="lab-title">
      <div className="lab-heading">
        <div>
          <p className="eyebrow"><span /> Laboratory · CityU Dongguan</p>
          <h2 id="lab-title">PYRENEES</h2>
          <p className="lab-full-name">Prognostics and cYber-physical Resilience Engineering Nexus for Equipment and System Safety</p>
        </div>
        <div className="lab-overview">
          <span className="lab-status">Laboratory development plan</span>
          <p>PYRENEES is the planned research laboratory of Weikun Deng at City University of Hong Kong (Dongguan), focusing on industrial system safety, resilience and autonomous maintenance.</p>
          <p>The plan brings together physics-informed machine learning, predictive maintenance and embodied inspection to support lifecycle intelligence for aviation, energy, advanced manufacturing and complex equipment.</p>
        </div>
      </div>

      <ol className="lab-pipeline" aria-label="Industrial intelligence research cycle">
        {['Sense', 'Model', 'Predict', 'Decide', 'Act'].map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}
      </ol>

      <div className="lab-directions">
        {directions.map((direction) => <article key={direction.title}><h3>{direction.title}</h3><p>{direction.detail}</p></article>)}
      </div>

      <div className="lab-platform-heading"><h3>Planned experimental platforms</h3><p>Equipment and facilities below are proposed; installation is not yet confirmed.</p></div>
      <div className="lab-platforms">
        {platforms.map((platform) => (
          <article key={platform.number}>
            <span className="lab-platform-number">{platform.number}</span>
            <div><h4>{platform.title}</h4><p>{platform.detail}</p><p className="lab-equipment">{platform.equipment}</p></div>
          </article>
        ))}
      </div>

      <div className="lab-plan-details">
        <details>
          <summary>Equipment specifications & computing budget</summary>
          <div className="lab-detail-content">
            <h4>AI computing centre · estimated CNY 253,500</h4>
            <dl className="lab-specifications">
              <div><dt>Workstation</dt><dd>Intel Xeon W5-3425 GPU workstation server; 12 cores / 24 threads, 3.2 GHz.</dd></div>
              <div><dt>Memory</dt><dd>Samsung DDR5-4800 ECC RDIMM, 32 GB × 8 (256 GB).</dd></div>
              <div><dt>Storage</dt><dd>Samsung 9100 PRO NVMe M.2 Gen5: 1 TB system drive and 4 TB data drive; 18 TB enterprise HDD and RAID expansion.</dd></div>
              <div><dt>GPUs</dt><dd>NVIDIA RTX PRO 6000 Workstation Edition, 96 GB × 2.</dd></div>
              <div><dt>Network</dt><dd>Intel X710-AT2 dual 10 GbE, plus 1 GbE IPMI management.</dd></div>
            </dl>
            <h4>Experimental equipment</h4>
            <ul>
              <li>Custom rotating machinery test bench: rotor–bearing system, adjustable-speed drive, vibration and temperature sensor interfaces, and mounting provision for data acquisition modules.</li>
              <li>Hiwonder hexapod robot, development kit, onboard computing module, RGB-D camera, IMU, and passive vibration, acoustic and temperature sensors.</li>
              <li>Bambu Lab X1 Carbon / P1S series 3D printer, engineering plastic and carbon-fibre-reinforced feedstock, and materials for sensor mounting structures.</li>
            </ul>
          </div>
        </details>
        <details>
          <summary>Space allocation · 30 m² within a 120 m² shared laboratory</summary>
          <div className="lab-detail-content">
            <p>The proposed PYRENEES research area occupies approximately 30 m² of a 120 m² shared laboratory.</p>
            <div className="lab-table-scroll"><table className="lab-space-table">
              <caption>Proposed allocation by function</caption>
              <thead><tr><th scope="col">Zone</th><th scope="col">Area</th><th scope="col">Use</th></tr></thead>
              <tbody>
                <tr><th scope="row">Embodied robotics</th><td>10 m²</td><td>Hexapod robots, RGB-D / IMU sensors and industrial inspection scenarios.</td></tr>
                <tr><th scope="row">Computing & student workspace</th><td>6 m²</td><td>GPU server, NAS, training workstation and data analysis; positioned near an external wall.</td></tr>
                <tr><th scope="row">Rotating machinery PHM</th><td>8 m²</td><td>Rotor test bench and degradation data acquisition.</td></tr>
                <tr><th scope="row">Rapid fabrication & specimens</th><td>6 m²</td><td>3D printing, pipe mock-ups and defect specimens.</td></tr>
              </tbody>
            </table></div>
          </div>
        </details>
        <details>
          <summary>Power, network, environment & safety provisions</summary>
          <div className="lab-detail-content">
            <h4>Power and network</h4>
            <ul>
              <li>Stable 220 V supply with separate circuits for the computing centre, rotating machinery and robot platforms.</li>
              <li>UPS protection for the GPU server, and high-speed wired networking between the server, NAS and experimental equipment.</li>
              <li>Provision for sensor power, data acquisition interfaces and protective grounding at the rotating machinery bench.</li>
            </ul>
            <h4>Environmental controls</h4>
            <ul>
              <li>Cooling and ventilation for sustained computing loads.</li>
              <li>Clear robot movement areas and safety boundaries.</li>
              <li>Fixed mounting of the rotating machinery bench, with access for operation and maintenance.</li>
              <li>A well-ventilated printing area and segregated material storage to limit dust and odour exposure in adjacent areas.</li>
            </ul>
            <h4>Safety and data management</h4>
            <ul>
              <li>Robot operating boundaries, emergency stops and operating procedures.</li>
              <li>Guards or isolation measures around high-speed rotating components.</li>
              <li>Electrical leakage protection, reliable grounding and equipment safety labels.</li>
              <li>Fire extinguishers, clear emergency access routes and emergency contact information.</li>
              <li>Centralized NAS storage and backup for experimental data integrity.</li>
            </ul>
          </div>
        </details>
        <details>
          <summary>Sensing & data acquisition</summary>
          <div className="lab-detail-content">
            <p>The proposed acquisition system combines mechanical condition, visual environment and robot behaviour data.</p>
            <dl className="lab-specifications">
              <div><dt>Vibration</dt><dd>Condition monitoring of rotating machinery.</dd></div>
              <div><dt>Temperature</dt><dd>Thermal condition analysis of bearings.</dd></div>
              <div><dt>Acoustics</dt><dd>Abnormal sound detection.</dd></div>
              <div><dt>IMU</dt><dd>Robot motion and state estimation.</dd></div>
              <div><dt>RGB-D vision</dt><dd>Environment reconstruction and defect detection.</dd></div>
            </dl>
          </div>
        </details>
        <details>
          <summary>Development milestones</summary>
          <div className="lab-detail-content">
            <h4>First year of development</h4>
            <p>Establish experimental capabilities in industrial system resilience, trustworthy industrial AI and embodied inspection.</p>
            <h4>Three-year objectives</h4>
            <ul>
              <li>Build an industrial PHM experimental database.</li>
              <li>Publish peer-reviewed research.</li>
              <li>Apply for invention patents and software copyright registrations.</li>
              <li>Support applications for national, provincial and municipal research funding.</li>
              <li>Develop joint research with industry on intelligent operation and maintenance.</li>
            </ul>
          </div>
        </details>
      </div>
    </section>
  );
}
