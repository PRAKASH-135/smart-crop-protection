function Setup() {
  return (
    <div className="setup-page">

      {/* PAGE HEADER */}

      <div className="setup-page-header">
        <h1>System Setup</h1>

        <p>
          Choose the protection setup suitable for your crop field.
        </p>
      </div>

      {/* BASIC SETUP */}

      <section className="setup-section">
        <img
          src="/setup/basic-setup.png"
          alt="Basic Crop Protection Setup"
          className="setup-image"
        />
      </section>

      {/* MEDIUM SETUP */}

      <section className="setup-section">
        <img
          src="/setup/medium-setup.png"
          alt="Medium Crop Protection Setup"
          className="setup-image"
        />
      </section>

      {/* ADVANCED SETUP */}

      <section className="setup-section">
        <img
          src="/setup/advanced-setup.png"
          alt="Advanced Crop Protection Setup"
          className="setup-image"
        />
      </section>

    </div>
  );
}

export default Setup;